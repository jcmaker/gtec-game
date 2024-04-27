"use client";
import { Button } from "@/components/ui/button";
import { getDocs, query, collection, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../../fbManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsDown, CircleHelp } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Home() {
  const [tetrisRank, setTetrisRank] = useState([]);
  const [loadRank, setLoadRank] = useState(10);

  useEffect(() => {
    const fetchRank = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "tetris"), orderBy("score", "desc"))
      );
      const RankData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTetrisRank(RankData);
    };

    fetchRank();
  }, []);

  const LoadMoreRank = () => {
    setLoadRank((prevValue) => prevValue + 10);
  };

  function formatScore(score) {
    if (score >= 1000000000) {
      return (score / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (score >= 1000000) {
      return (score / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (score >= 1000) {
      return (score / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return score; // 점수가 1000 미만인 경우 그대로 반환
  }

  if (!tetrisRank) {
    // Check if data is still loading
    return (
      <main className="flex flex-col items-center w-screen h-screen">
        <div className="w-screen h-[300px] flex justify-center items-center p-10 bg-[#fafafa]">
          <Skeleton className="w-[280px] h-[100px]" />{" "}
          {/* Placeholder for the button */}
        </div>
        <div className="w-full flex justify-center p-20">
          <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-100 px-6 py-4">
              <Skeleton className="w-32 h-6" />{" "}
              {/* Placeholder for the title */}
            </CardHeader>
            <CardContent className="px-6 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>
                      <Skeleton className="w-10 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-24 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-24 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-10 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-10 h-4" />
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map(
                      (
                        _,
                        index // Create 5 skeleton rows
                      ) => (
                        <TableRow
                          key={index}
                          className={index % 2 ? "bg-gray-100" : ""}
                        >
                          <TableCell>
                            <Skeleton className="w-10 h-4" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-24 h-4" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-24 h-4" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-10 h-4" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-10 h-4" />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center w-screen h-screen overflow-hidden overflow-y-scroll">
      <div className="w-screen h-[300px] flex justify-center items-center p-10 bg-[#fafafa]">
        <Link href="/tetris">
          <Button className="w-[280px] h-[100px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-xl">
            Play Game
          </Button>
        </Link>
      </div>
      <div className="w-full flex justify-center md:p-20">
        <Card className="w-full max-w-md bg-white  shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-100  px-6 py-4 w-full flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-bold">
              Leaderboard
              <span className="text-slate-500 font-light text-sm">TETRIS</span>
            </CardTitle>
            <HoverCard>
              <HoverCardTrigger>
                <CircleHelp className="text-slate-500" />
              </HoverCardTrigger>
              <HoverCardContent>
                <Link href="https://tetris.wiki/Scoring#Original_Nintendo_scoring_system">
                  <p>점수제도</p>
                  <p class="text-blue-600 underline">
                    Original Nintendo Scoring
                  </p>
                </Link>
              </HoverCardContent>
            </HoverCard>
          </CardHeader>
          <CardContent className="md:px-6 md:py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>순위</TableHead>
                  <TableHead>닉네임</TableHead>
                  <TableHead>Lv</TableHead>
                  <TableHead>점수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tetrisRank.slice(0, loadRank).map((player, index) => (
                  <TableRow
                    key={player.id}
                    className={index % 2 ? "bg-gray-100 w-full" : "w-full"}
                  >
                    <TableCell>{index + 1 == 1 ? "👑" : index + 1}</TableCell>
                    <TableCell className="flex flex-col">
                      <span className="font-bold">{player?.nickName}</span>

                      <span className="text-slate-400">
                        {player?.department}
                      </span>
                    </TableCell>
                    <TableCell>{player?.level}</TableCell>
                    <TableCell> {formatScore(player?.score)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div
              onClick={LoadMoreRank}
              className="w-full flex justify-center items-center p-2"
            >
              <ChevronsDown />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
