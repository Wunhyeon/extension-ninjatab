import { PlayIcon } from "@/lib/svgToTs/PlayIcon";
import { RotateCcwIcon } from "lucide-react";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActivePath = (path: string) => {
    return location.pathname === path ? "bg-zinc-100" : "";
  };
  const login = () => {
    chrome.runtime.sendMessage({ type: "LOGIN" }, (response) => {
      console.log("login response : ", response);
    });
  };

  return (
    <div className="w-80">
      Layout!@
      <button
        onClick={() => {
          login();
        }}
      >
        Login
      </button>
      <div>
        <Outlet />
      </div>
      <div className="p-2  flex justify-around">
        <button
          onClick={() => {
            navigate("/");
          }}
          className={`${isActivePath(
            "/"
          )} rounded-lg flex-1 flex flex-col p-1 items-center justify-center`}
        >
          <PlayIcon />
          Shortcuts
        </button>
        <button
          onClick={() => {
            navigate("/restore");
          }}
          className={`${isActivePath(
            "/restore"
          )} rounded-lg flex-1 flex flex-col p-1 items-center justify-center`}
        >
          <RotateCcwIcon strokeWidth={1.5} className="size-6" />
          Restore
        </button>
      </div>
    </div>
  );
};
