// import { Database } from "@/lib/database.types";
import { BlueBadge } from "@/components/Badge";
import { LOGIN, LOGOUT, SITE_URL, USER_STATE } from "@/lib/constant";
import { useUser } from "@/lib/store/user";
import { GoogleLoginBtn } from "@/lib/svgToTs/GoogleLoginBtn";
import { PlayIcon } from "@/lib/svgToTs/PlayIcon";
import { UserEmailWithSubsriptionStatus } from "@/lib/type";
import { RotateCcwIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userState, setUserState] =
    useState<UserEmailWithSubsriptionStatus | null>(null);
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false);

  const isActivePath = (path: string) => {
    return location.pathname === path ? "bg-zinc-100" : "";
  };

  const login = () => {
    chrome.runtime.sendMessage(
      { type: LOGIN },
      (response: {
        success: boolean;
        user?: UserEmailWithSubsriptionStatus[] | null;
      }) => {
        console.log("login response : ", response);
        if (response.user && response.user.length > 0) {
          setUserState(response.user[0]);
          if (
            response.user[0].subscriptions.length > 0 &&
            response.user[0].subscriptions[0].status !== "expired"
          ) {
            setIsSubscribe(true);
          }
          useUser.setState({ user: response.user[0] });
        }
      }
    );
  };

  const logout = () => {
    chrome.runtime.sendMessage({ type: LOGOUT });
    useUser.setState({ user: null });
    setUserState(null);
  };

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: USER_STATE },
      (response: {
        success: boolean;
        user?: UserEmailWithSubsriptionStatus[] | null;
      }) => {
        console.log("@@@ user state response : ", response);
        if (response && response.user && response.user.length > 0) {
          setUserState(response.user[0]);
          if (
            response.user[0].subscriptions.length > 0 &&
            response.user[0].subscriptions[0].status !== "expired"
          ) {
            setIsSubscribe(true);
          }
          useUser.setState({ user: response.user[0] });
        }
      }
    );
  }, []);

  return (
    <div className="w-80">
      <div className="p-2 flex justify-around">
        <h2 className="inline text-2xl font-bold text-center">
          <a href={SITE_URL} target="_blank">
            🥷
          </a>
        </h2>
        {userState ? (
          <div className="flex justify-between">
            <div>
              {userState.email} {isSubscribe && <BlueBadge text={"Pro"} />}
            </div>
            <div>
              <button
                onClick={() => {
                  logout();
                }}
                className="border rounded bg-zinc-100 mx-3"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              login();
            }}
          >
            <GoogleLoginBtn />
          </button>
        )}
      </div>
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
