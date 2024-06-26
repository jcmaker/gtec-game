"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { useBoard } from "./useBoard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "../../../../fbManager";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  RotateCcw,
} from "lucide-react";

const Board = () => {
  const router = useRouter();
  const [display, score, onKeyDown, level, lineCount, isGameOver] = useBoard();
  const eBoard = useRef();
  const [nickName, setNickName] = useState("");
  const [department, setDepartment] = useState();

  const handleLeft = () => onKeyDown("ArrowLeft");
  const handleRight = () => onKeyDown("ArrowRight");
  const handleDown = () => onKeyDown("ArrowDown");
  const handleRotate = () => onKeyDown("ArrowUp");
  const handleDrop = () => onKeyDown(" ");

  useEffect(() => {
    if (eBoard.current) {
      eBoard.current.focus();
    }
  }, []);

  const uploadToFirestore = async () => {
    if (!nickName || !department) {
      toast.error("학과 또는 이름을 입력해주세요.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tetris"), {
        nickName,
        department,
        score,
        level,
        lineCount,
        timestamp: serverTimestamp(),
      });
      toast.success("점수 등록 완료");
      setNickName("");
      setDepartment("");
      router.push("/");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleNickNameChange = (event) => {
    setNickName(event.target.value);
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  };

  return (
    <div
      ref={eBoard}
      className="fixed top-0 md:inline-block md:p-5 md:border md:border-green-500 focus:outline-none "
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* <div className="md:hidden absolute w-screen h-screen bg-slate-50 dark:bg-gray-700 flex flex-col justify-center items-center top-0 left-0 z-50">
        모바일 화면 준비중!
        <Link href="/">
          <Button>돌아가기</Button>
        </Link>
      </div> */}
      <div className="flex justify-between items-center">
        <span className="">점수:</span>
        <span className="">{score.toLocaleString()}</span>
        <br />
        <span className="">레벨:</span>
        <span className="">{level}</span>
        <br />
        <span className="">클리어 라인:</span>
        <span className="">{lineCount.toLocaleString()}</span>
      </div>
      <Dialog>
        <DialogTrigger as="button" disabled={!isGameOver}>
          <Button disabled={!isGameOver}>랭킹 등록</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
            <DialogDescription>
              축하합니다! 지금 바로 랭킹에 이름을 올려 경쟁자들과 비교해 보세요.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="dep">학과</Label>
          <Select id="dep" onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="학과 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>크리에이티브&콘텐츠</SelectLabel>
                <SelectItem value="디자인공학과">디자인공학과</SelectItem>
                <SelectItem value="웹툰일러스트학과">
                  웹툰일러스트학과
                </SelectItem>
                <SelectItem value="게임콘텐츠학과">게임콘텐츠학과</SelectItem>
                <SelectItem value="영상디자인과">영상디자인과</SelectItem>
                <SelectItem value="시각정보디자인학과">
                  시각정보디자인학과
                </SelectItem>
                <SelectItem value="패션디자인과">패션디자인과</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>ICT&소프트웨어</SelectLabel>
                <SelectItem value="컴퓨터모바일융합과">
                  컴퓨터모바일융합과
                </SelectItem>
                <SelectItem value="인공지능학과">인공지능학과</SelectItem>
                <SelectItem value="메카트로닉스공학과">
                  메카트로닉스공학과
                </SelectItem>
                <SelectItem value="모빌리티공학과">모빌리티공학과</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>휴먼&라이프</SelectLabel>
                <SelectItem value="건축인테리어학과">
                  건축인테리어학과
                </SelectItem>
                <SelectItem value="보건의료행정학과">
                  보건의료행정학과
                </SelectItem>
                <SelectItem value="생명화학공학과">생명화학공학과</SelectItem>
                <SelectItem value="소방방재학과">소방방재학과</SelectItem>
                <SelectItem value="사회복지학과">사회복지학과</SelectItem>
                <SelectItem value="경영학과">경영학과</SelectItem>
                <SelectItem value="군사학과">군사학과</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>테크놀로지&이노베이션</SelectLabel>
                <SelectItem value="전기공학과">전기공학과</SelectItem>
                <SelectItem value="기계공학과">기계공학과</SelectItem>
                <SelectItem value="미래전기자동차과">
                  미래전기자동차과
                </SelectItem>
                <SelectItem value="전자공학과">전자공학과</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label htmlFor="name">닉네임</Label>
          <Input
            type="text"
            id="name"
            placeholder="ex)홍길동"
            value={nickName}
            onChange={handleNickNameChange}
          />
          <Label htmlFor="point">점수</Label>
          <Input
            type="text"
            id="point"
            placeholder={score}
            value={score}
            disabled
          />
          <Button onClick={uploadToFirestore} type="button">
            등록하기
          </Button>
        </DialogContent>
      </Dialog>
      {isGameOver ? <span>Game Over</span> : ""}
      {display.map((row, index) => (
        <Row row={row} key={index} />
      ))}

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gray-800 opacity-50 flex justify-between text-white">
        <button onClick={handleRotate}>
          <RotateCcw className="text-white" />
        </button>
        <button onClick={handleDrop}>
          <ChevronsDown />
        </button>
        <button onClick={handleLeft}>
          <ChevronLeft />
        </button>
        <button onClick={handleDown}>
          <ChevronDown />
        </button>
        <button onClick={handleRight}>
          <ChevronRight />
        </button>
      </div>
      <Toaster />
    </div>
  );
};

const Row = memo((props) => {
  return (
    <span className="flex">
      {props.row.map((cell, index) => (
        <Cell cell={cell} key={index} />
      ))}
    </span>
  );
});

// Explicitly set display names for components that are wrapped with `memo`
Row.displayName = "Row";

const Cell = memo(({ cell }) => {
  // Define the base style for a cell
  let baseStyle = "inline-block w-7 h-7 box-border";
  // Add specific styles based on the cell value
  let cellStyle =
    baseStyle +
    (cell
      ? ` bg-[#0AA144] border border-slate-200 rounded`
      : ` bg-slate-200 dark:bg-slate-800 border-none`);

  return <span className={`${cellStyle}`}></span>;
});

// Set a display name for the Cell component
Cell.displayName = "Cell";

// Wrap and export the Board component with memo and set its display name
const MemoizedBoard = memo(Board);
MemoizedBoard.displayName = "Board";

export default MemoizedBoard;
