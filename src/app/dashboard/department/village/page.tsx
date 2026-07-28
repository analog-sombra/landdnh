"use client";

import { ApiCall } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Table, Select, Button, Space, message, Spin, Drawer, Form } from "antd";
import { getCookie } from "cookies-next/client";
import { useState } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

interface Village {
  id: number;
  name: string;
  talati_id: number | null;
  pda_id: number | null;
  mamlatar_id: number | null;
  rak_id: number | null;
  circle_officer_id: number | null;
  ldc_mamlatar_id: number | null;
  dy_collector_id: number | null;
  talati?: User;
  pda?: User;
  mamlatar?: User;
  rak?: User;
  circle_officer?: User;
  ldc_mamlatar?: User;
  dy_collector?: User;
}

interface UserListResponse {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

interface VillageListResponse {
  id: number;
  name: string;
  talati_id: number | null;
  pda_id: number | null;
  mamlatar_id: number | null;
  rak_id: number | null;
  circle_officer_id: number | null;
  ldc_mamlatar_id: number | null;
  dy_collector_id: number | null;
  talati?: User;
  pda?: User;
  mamlatar?: User;
  rak?: User;
  circle_officer?: User;
  ldc_mamlatar?: User;
  dy_collector?: User;
}

const OFFICER_ROLE_MAP: Record<string, string> = {
  talati: "TALATHI",
  pda: "PDA_JE",
  rak: "RAK",
  circle_officer: "CIRCLEOFFICER",
  dy_collector: "DEPUTYCOLLECTOR",
  ldc_mamlatar: "LDCMAMLATDAR",
  mamlatar: "MAMLATDAR",
};

const VillagePage = () => {
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingVillage, setEditingVillage] = useState<Village | null>(null);

  const getFilteredUsersByRole = (fieldName: string) => {
    const role = OFFICER_ROLE_MAP[fieldName];
    if (!role || !usersData.data) return [];
    return usersData.data.filter((user) => user.role === role);
  };

  // Fetch all villages
  const villageData = useQuery({
    queryKey: ["getAllVillages"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query { getAllVillage { id, name, talati_id, pda_id, mamlatar_id, rak_id, circle_officer_id, ldc_mamlatar_id, dy_collector_id, talati { id, firstName, lastName, role }, pda { id, firstName, lastName, role }, mamlatar { id, firstName, lastName, role }, rak { id, firstName, lastName, role }, circle_officer { id, firstName, lastName, role }, ldc_mamlatar { id, firstName, lastName, role }, dy_collector { id, firstName, lastName, role } } }",
        variables: {},
      });

      console.log("Village Response:", response);
      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getAllVillage"]) {
        throw new Error("Villages not found in response");
      }

      return (response.data as Record<string, unknown>)[
        "getAllVillage"
      ] as VillageListResponse[];
    },
  });

  // Fetch all users
  const usersData = useQuery({
    queryKey: ["getAllUsers"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query: "query { getUserList { id, firstName, lastName, role } }",
        variables: {},
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getUserList"]) {
        throw new Error("Users not found in response");
      }

      return (response.data as Record<string, unknown>)[
        "getUserList"
      ] as UserListResponse[];
    },
  });

  const handleOpenDrawer = (record: Village) => {
    setEditingVillage(record);
    form.setFieldsValue({
      talati_id: record.talati_id || undefined,
      pda_id: record.pda_id || undefined,
      mamlatar_id: record.mamlatar_id || undefined,
      rak_id: record.rak_id || undefined,
      circle_officer_id: record.circle_officer_id || undefined,
      ldc_mamlatar_id: record.ldc_mamlatar_id || undefined,
      dy_collector_id: record.dy_collector_id || undefined,
    });
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setEditingVillage(null);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    if (!editingVillage) return;

    try {
      const updates = [];

      // Check which fields have changed
      const officerFields = [
        { key: "talati_id", type: "talati" },
        { key: "pda_id", type: "pda" },
        { key: "mamlatar_id", type: "mamlatar" },
        { key: "rak_id", type: "rak" },
        { key: "circle_officer_id", type: "circle_officer" },
        { key: "ldc_mamlatar_id", type: "ldc_mamlatar" },
        { key: "dy_collector_id", type: "dy_collector" },
      ];

      for (const field of officerFields) {
        if (
          values[field.key] !== undefined &&
          values[field.key] !== editingVillage[field.key as keyof Village]
        ) {
          updates.push(
            ApiCall({
              query:
                "mutation UpdateVillageOfficer($villageId: Int!, $officerType: String!, $officerId: Int!) { updateVillageOfficer(villageId: $villageId, officerType: $officerType, officerId: $officerId) { id, name, talati_id, pda_id, mamlatar_id, rak_id, circle_officer_id, ldc_mamlatar_id, dy_collector_id } }",
              variables: {
                villageId: editingVillage.id,
                officerType: field.type,
                officerId: values[field.key],
              },
            }),
          );
        }
      }

      if (updates.length === 0) {
        message.info("No changes to save");
        return;
      }

      const results = await Promise.all(updates);

      if (results.every((r) => r.status)) {
        message.success("Officers updated successfully");
        villageData.refetch();
        handleCloseDrawer();
      } else {
        message.error("Failed to update some officers");
      }
    } catch (error) {
      message.error("Failed to update officers");
    }
  };

  const columns = [
    {
      title: "Village Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Talati",
      key: "talati",
      render: (_: any, record: Village) => record.talati?.firstName || "-",
    },
    {
      title: "PDA",
      key: "pda",
      render: (_: any, record: Village) => record.pda?.firstName || "-",
    },
    {
      title: "Mamlatar",
      key: "mamlatar",
      render: (_: any, record: Village) => record.mamlatar?.firstName || "-",
    },
    {
      title: "RAK",
      key: "rak",
      render: (_: any, record: Village) => record.rak?.firstName || "-",
    },
    {
      title: "Circle Officer",
      key: "circle_officer",
      render: (_: any, record: Village) =>
        record.circle_officer?.firstName || "-",
    },
    {
      title: "LDC Mamlatar",
      key: "ldc_mamlatar",
      render: (_: any, record: Village) =>
        record.ldc_mamlatar?.firstName || "-",
    },
    {
      title: "Deputy Collector",
      key: "dy_collector",
      render: (_: any, record: Village) =>
        record.dy_collector?.firstName || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Village) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleOpenDrawer(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  if (villageData.isLoading || usersData.isLoading) {
    return <Spin size="large" className="grid place-items-center h-screen" />;
  }

  if (villageData.isError || usersData.isError) {
    return (
      <div className="text-red-500">Error loading data. Please refresh.</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Village Officers Management</h1>
      <Table
        columns={columns}
        dataSource={villageData.data || []}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title={`Edit Officers - ${editingVillage?.name || ""}`}
        placement="right"
        onClose={handleCloseDrawer}
        open={drawerVisible}
        width={600}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={handleCloseDrawer}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Save Changes
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          disabled={usersData.isLoading}
        >
          <Form.Item
            label="Talati"
            name="talati_id"
            tooltip="Select the Talati officer for this village"
          >
            <Select
              placeholder="Select Talati"
              allowClear
              options={getFilteredUsersByRole("talati").map(
                (user: UserListResponse) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                }),
              )}
            />
          </Form.Item>

          <Form.Item
            label="PDA"
            name="pda_id"
            tooltip="Select the PDA officer for this village"
          >
            <Select
              placeholder="Select PDA"
              allowClear
              options={getFilteredUsersByRole("pda").map(
                (user: UserListResponse) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                }),
              )}
            />
          </Form.Item>

          <Form.Item
            label="Mamlatar"
            name="mamlatar_id"
            tooltip="Select the Mamlatar officer for this village"
          >
            <Select
              placeholder="Select Mamlatar"
              allowClear
              options={getFilteredUsersByRole("mamlatar").map(
                (user: UserListResponse) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                }),
              )}
            />
          </Form.Item>

          <Form.Item
            label="RAK"
            name="rak_id"
            tooltip="Select the RAK officer for this village"
          >
            <Select
              placeholder="Select RAK"
              allowClear
              options={getFilteredUsersByRole("rak").map(
                (user: UserListResponse) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                }),
              )}
            />
          </Form.Item>

          <Form.Item
            label="Circle Officer"
            name="circle_officer_id"
            tooltip="Select the Circle Officer for this village"
          >
            <Select
              placeholder="Select Circle Officer"
              allowClear
              options={getFilteredUsersByRole("circle_officer").map(
                (user: UserListResponse) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                }),
              )}
            />
          </Form.Item>

          <Form.Item
            label="LDC Mamlatar"
            name="ldc_mamlatar_id"
            tooltip="Select the LDC Mamlatar officer for this village"
          >
            <Select
              placeholder="Select LDC Mamlatar"
              allowClear
              options={getFilteredUsersByRole("ldc_mamlatar").map(
                (user: UserListResponse) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                }),
              )}
            />
          </Form.Item>

          <Form.Item
            label="Deputy Collector"
            name="dy_collector_id"
            tooltip="Select the Deputy Collector officer for this village"
          >
            <Select
              placeholder="Select Deputy Collector"
              allowClear
              options={getFilteredUsersByRole("dy_collector").map(
                (user: UserListResponse) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id,
                }),
              )}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default VillagePage;
