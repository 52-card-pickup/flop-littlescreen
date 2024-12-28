import { useEffect } from "react";
import { useClient } from "../flopClient";
import { useNavigate } from "@remix-run/react";

export default function Reset() {
  const { client } = useClient();
  const navigate = useNavigate();
  useEffect(() => {
    client
      .POST("/api/v1/room/reset", {})
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        navigate("/");
      });
  }, [navigate]);
  return null;
}
