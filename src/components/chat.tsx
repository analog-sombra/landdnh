// interface DeptChatProps {
//   name: string;
//   fromrole: string;
//   torole: string;
//   message: string;
//   time: Date;
//   url?: string | null;
//   type: string;
// }

import { queryStatus } from "@/utils/utilscompoment";
import { ViewEditor } from "./editors/vieweditro/page";
import { formatDateTime, roleToString } from "@/utils/methods";

// const DeptChat = (props: DeptChatProps) => {
//   return (
//     <div className="bg-white px-4 py-2 rounded shadow-md mt-3 w-5/6">
//       <div className="flex items-center border-b border-gray-200 pb-1">
//         <div className="shrink-0 h-8 w-8 rounded-full bg-rose-500 grid place-items-center text-xs text-white font-semibold">
//           {props.name.charAt(0).toUpperCase()}
//         </div>
//         <div className="px-2">
//           <p className="text-sm text-gray-700 font-semibold leading-2">
//             {roleToString(props.fromrole)} to {roleToString(props.torole)}
//           </p>
//           <p className="text-xs leading-4 mt-1 text-gray-600">
//             {formatDateTime(props.time)}
//           </p>
//         </div>
//         <div className="grow"></div>
//         {queryStatus(props.type)}
//       </div>
//       {/* <p className="text-sm leading-4 mt-2">{props.message}</p> */}
//       <ViewEditor data={props.message} />

//       {props.url && (
//         <div className="flex">
//           <div className="grow"></div>
//           <button
//             // target="_blank"
//             // href={props.url}
//             onClick={() => window.open(props.url ?? "", "_blank")}
//             className="w-20 py-1 text-center text-sm text-nowrap block text-white bg-blue-500 px-2 rounded mt-2"
//           >
//             View File
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

interface UserChatProps {
  name: string;
  fromrole: string;
  torole: string;
  message: string;
  time: Date;
  url?: string | null;
  type: string;
}

const UserChat = (props: UserChatProps) => {
  return (
    <div className="py-2 px-2">
      <div className="flex items-center pb-4">
        <div>
          <p className="text-sm text-blue-700 font-semibold leading-2">
            {roleToString(props.fromrole)}
          </p>
          <p className="text-xs leading-4 mt-1 text-gray-600">
            {formatDateTime(props.time)}
          </p>
        </div>
        <div className="grow"></div>
        {queryStatus(props.type)}
        {/* <div className="grow"></div> */}
      </div>
      <ViewEditor data={props.message} />
      {/* <p className="text-sm leading-4 mt-2">{props.message}</p> */}
      {props.url && (
        <div className="flex">
          <div className="grow"></div>
          <button
            onClick={() => window.open(props.url ?? "", "_blank")}
            className="w-20 py-1 text-center text-sm text-nowrap block text-white bg-blue-500 px-2 rounded mt-2"
          >
            View File
          </button>
        </div>
      )}
      <div className="h-[1px] w-full bg-gray-200 mt-2"></div>
    </div>
  );
};

interface ShowEditorProps {
  name: string;
  fromrole: string;
  torole: string;
  data: string;
  time: Date;
  type: string;
}

const ShowEditor = (props: ShowEditorProps) => {
  return (
    <div className="py-2 px-2">
      <div className="flex items-center pb-4">
        <div>
          <p className="text-sm text-blue-700 font-semibold leading-2">
            {roleToString(props.fromrole)}
          </p>
          <p className="text-xs leading-4 mt-1 text-gray-600">
            {formatDateTime(props.time)}
          </p>
        </div>
        <div className="grow"></div>
        {queryStatus(props.type)}
      </div>
      <ViewEditor data={props.data} />
      <div className="h-[1px] w-full bg-gray-200 mt-2"></div>
    </div>
  );
};

export { UserChat, ShowEditor };
