import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export default function MainIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    // /main으로 접근하면 /main/home으로 리다이렉트
    navigate("/main/home", { replace: true });
  }, [navigate]);

  return null;
}


