import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Pause, Play, SkipForward, SkipBack } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export default function Focus() {
  const { user } = useContext(AuthContext);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#2b2d2e]"></div>
  );
}
