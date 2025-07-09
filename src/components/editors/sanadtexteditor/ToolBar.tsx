import {
  FlowbiteUndoOutline,
  FlowbiteUndoSolid,
  FluentArrowCircleDown32Regular,
  FluentSave32Regular,
  FluentTextAlignCenter24Regular,
  FluentTextAlignJustify24Regular,
  FluentTextAlignLeft24Regular,
  FluentTextAlignRight24Regular,
  FluentTextClearFormatting32Light,
} from "@/components/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { mergeRegister } from "@lexical/utils";
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { Select } from "antd";
import { $generateHtmlFromNodes } from "@lexical/html";
import TablePlugin from "./TablePlugin";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";
import { ApiCall } from "@/services/api";
import { useRouter } from "next/navigation";

const headingOptions = [
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
  { label: "H5", value: "h5" },
  { label: "H6", value: "h6" },
];

const fontSizes = [
  { label: "10", value: "10" },
  { label: "12", value: "12" },
  { label: "14", value: "14" },
  { label: "16", value: "16" },
  { label: "18", value: "18" },
  { label: "20", value: "20" },
  { label: "24", value: "24" },
  { label: "28", value: "28" },
  { label: "32", value: "32" },
  { label: "36", value: "36" },
  { label: "40", value: "40" },
  { label: "44", value: "44" },
  { label: "48", value: "48" },
  { label: "52", value: "52" },
  { label: "56", value: "56" },
  { label: "60", value: "60" },
  { label: "64", value: "64" },
  { label: "68", value: "68" },
  { label: "72", value: "72" },
  { label: "76", value: "76" },
  { label: "80", value: "80" },
  { label: "84", value: "84" },
  { label: "88", value: "88" },
  { label: "92", value: "92" },
  { label: "96", value: "96" },
];

const fontFamilies = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: "Impact", value: "Impact, Charcoal, sans-serif" },
];

interface ToolBarProps {
  id: number;
}

const ToolBar = ({ id }: ToolBarProps) => {
  const userid = getCookie("id");

  const [editor] = useLexicalComposerContext();
  const queryClient = useQueryClient();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [heading, setHeading] = useState("h1");
  const [fontSize, setFontSizeState] = useState<number>(14);
  const [fontFamily, setFontFamily] = useState<string>("");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
    }
  }, []);

  const handleSave = useDebouncedCallback((content) => {
    // console.log("Saving content:", content);
    // editor.update(() => {
    //   const state = editor.getEditorState();
    //   // Save the state to local storage or server
    //   localStorage.setItem("editorState", JSON.stringify(state.toJSON()));
    // });
  }, 500);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          editorState.read(() => {
            $updateToolbar();
          });

          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
            editorState.read(() => {
              handleSave(JSON.stringify(editorState));
            });
          }
        }
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  const handleHeading = (level: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          $createHeadingNode(level as HeadingTagType)
        );
      }
    });
  };

  function setFontSize(size: string) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(() => {
          // if ($isTextNode(node)) {
          //   node.setStyle(`font-size: ${size}px`);
          // }
          $patchStyleText(selection, { "font-size": `${size}px` });
        });
      }
    });
  }
  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
          }
        });
      }
    });
  };
  function setFontFamilyStyle(family: string) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-family": family });
      }
    });
  }

  function downloadAsPDF() {
    editor.read(async () => {
      const htmlString = $generateHtmlFromNodes(editor, null);

      const container = document.createElement("div");
      container.innerHTML = htmlString;
      container.style.background = "#fff";
      container.style.color = "#000";
      container.style.padding = "20px";
      container.style.width = "800px"; // Logical layout width
      container.style.position = "fixed"; // Prevent page shift
      container.style.left = "-9999px"; // Hide off-screen

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        backgroundColor: "#fff",
        scale: 2, // Higher scale for better resolution
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let position = 0;

      if (imgHeight < pageHeight) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      } else {
        // Handle multi-page PDF
        while (position < imgHeight) {
          pdf.addImage(
            imgData,
            "PNG",
            0,
            position ? 0 : position,
            imgWidth,
            imgHeight
          );
          position += pageHeight;
          if (position < imgHeight) {
            pdf.addPage();
          }
        }
      }

      pdf.save("document.pdf");
      document.body.removeChild(container);
    });
  }

  const saveToDatabase = () => {
    editor.update(() => {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();

      createquery.mutate(
        {
          query: JSON.stringify(json),
        },
        {
          onSuccess: () => {
            queryClient.refetchQueries({
              queryKey: ["getQueryByType", Number(id)],
            });
            queryClient.invalidateQueries({
              queryKey: ["getQueryByType", Number(id)],
            });
          },
        }
      );
    });
  };

  interface CreateQueryType {
    query: string;
  }

  interface QueryResponseData {
    id: number;
  }
  const router = useRouter();

  const createquery = useMutation({
    mutationKey: ["createNaQuery"],
    mutationFn: async (data: CreateQueryType) => {
      if (!userid) {
        toast.error("User ID not found");
        return;
      }

      const response = await ApiCall({
        query:
          "mutation CreateNaQuery($createNaQueryInput: CreateNaQueryInput!) {createNaQuery(createNaQueryInput: $createNaQueryInput) {id}}",
        variables: {
          createNaQueryInput: {
            createdById: parseInt(userid.toString()),
            from_userId: parseInt(userid.toString()),
            to_userId: parseInt(userid.toString()),
            query: data.query,
            type: "SANAD",
            na_formId: id,
            query_status: "PENDING",
            request_type: "DEPTTODEPT",
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["createNaQuery"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "createNaQuery"
      ] as QueryResponseData;
    },
    onSuccess: () => {
      toast.success("Zimni created successfully");
      router.back();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex py-1 gap-1 items-center flex-wrap">
        <div className="flex items-center gap-1 px-2 py-2 border border-gray-200 rounded-md">
          <button
            className="px-1"
            disabled={!canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
          >
            <FlowbiteUndoOutline />
          </button>
          <button
            disabled={!canRedo}
            className="px-1"
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
          >
            <FlowbiteUndoSolid />
          </button>
        </div>

        <div className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md">
          <button
            className={`font-bold px-2 ${isBold ? "bg-gray-200 rounded" : ""}`}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
          >
            B
          </button>
          <button
            className={`italic px-2 ${isItalic ? "bg-gray-200 rounded" : ""}`}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
          >
            I
          </button>
          <button
            className={`underline px-2 ${
              isUnderline ? "bg-gray-200 rounded" : ""
            }`}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
          >
            U
          </button>
          <button
            className={`line-through px-2 ${
              isStrikethrough ? "bg-gray-200 rounded" : ""
            }`}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
          >
            S
          </button>

          <button
            className={`px-2 ${isSubscript ? "bg-gray-200 rounded" : ""}`}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
            }}
          >
            <sub>sub</sub>
          </button>
          <button
            className={`px-2 ${isSuperscript ? "bg-gray-200 rounded" : ""}`}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
            }}
          >
            <sup>sup</sup>
          </button>

          <button className="px-1" onClick={clearFormatting}>
            <FluentTextClearFormatting32Light />
          </button>
        </div>

        <Select
          value={heading}
          onChange={(value) => {
            setHeading(value);
            handleHeading(value);
          }}
          options={headingOptions}
        />
        <Select
          value={fontSize}
          onChange={(value) => {
            setFontSizeState(value);
            setFontSize(String(value));
          }}
          options={fontSizes}
        />

        {/* <InputNumber
          className=" h-8 w-32"
          min={1}
          max={1000}
          changeOnWheel
          defaultValue={fontSize}
          value={fontSize}
          addonBefore={
            <Select
              value={fontSize}
              onChange={(value) => {
                setFontSizeState(value);
                setFontSize(String(value));
              }}
              options={fontSizes}
            />
          }
          onChange={(value) => {
            if (value === null) return;
            setFontSize(String(value));
            setFontSizeState(value);
          }}
        /> */}
        <Select
          className="mx-2 w-40"
          value={fontFamily}
          onChange={(value) => {
            setFontFamily(value);
            setFontFamilyStyle(value);
          }}
          options={fontFamilies.map((f) => ({
            ...f,
            label: (
              <span style={{ fontFamily: f.value || "inherit" }}>
                {f.label}
              </span>
            ),
          }))}
          dropdownRender={() => (
            <div>
              {fontFamilies.map((f) => (
                <div
                  key={f.value}
                  style={{
                    fontFamily: f.value || "inherit",
                    padding: "4px 12px",
                    cursor: "pointer",
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setFontFamily(f.value);
                    setFontFamilyStyle(f.value);
                  }}
                >
                  {f.label}
                </div>
              ))}
            </div>
          )}
        />
        <div className="flex items-center gap-1 px-2 py-2 border border-gray-200 rounded-md">
          <button className="px-2 cursor-pointer" onClick={downloadAsPDF}>
            <FluentArrowCircleDown32Regular />
          </button>
          <button className="px-2 cursor-pointer" onClick={saveToDatabase}>
            <FluentSave32Regular />
          </button>
          <TablePlugin />
        </div>

        <div className="flex items-center gap-1 px-2 py-2 border border-gray-200 rounded-md">
          <button
            className="px-2"
            title="Align Center"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
            }
            type="button"
          >
            <FluentTextAlignCenter24Regular />
          </button>
          <button
            className="px-2"
            title="Align Justify"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
            }
            type="button"
          >
            <FluentTextAlignJustify24Regular />
          </button>
          <button
            className="px-2"
            title="Align Left"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
            }
            type="button"
          >
            <FluentTextAlignLeft24Regular />
          </button>
          <button
            className="px-2"
            title="Align Right"
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
            }
            type="button"
          >
            <FluentTextAlignRight24Regular />
          </button>
        </div>
      </div>
    </>
  );
};
export default ToolBar;
