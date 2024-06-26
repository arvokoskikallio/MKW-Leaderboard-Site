import React from 'react'
import { AFChartRow, LeaderBoardTimeEntry, LeaderboardChartRow, PRSRChartRow, TotalTimeChartRow } from "../types";

export const formatTime = (runTime: number | null, link: string | null): JSX.Element | null => {

  if(!runTime) {
    return null;
  }

  // Convert milliseconds to minutes, seconds, and remaining milliseconds
  const totalSeconds = Math.floor(runTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remainingMilliseconds = runTime % 1000;

  // Format the time components
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds.toString();
  const millisecondsStr =
    remainingMilliseconds < 10
      ? `00${remainingMilliseconds}`
      : remainingMilliseconds < 100
      ? `0${remainingMilliseconds}`
      : remainingMilliseconds.toString();

  // Create the formatted time string
  const formattedTime = `${minutes}:${secondsStr}.${millisecondsStr}`;

  if (link) {
    return (
      <a href={`${link}`} target="_blank" rel="noopener noreferrer">
        {formattedTime}
      </a>
    );
  } else {
    return <span>{formattedTime}</span>;
  }
};

export const formatTotalTime = (totalTime: number): JSX.Element => {
  if(totalTime === 0) {
    return <span></span>
  }
  // Convert milliseconds to minutes, seconds, and remaining milliseconds
  const totalSeconds = Math.floor(totalTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remainingMilliseconds = totalTime % 1000;

  // Format the time components
  const secondsStr = seconds < 10 ? `0${seconds}` : seconds.toString();
  const millisecondsStr =
    remainingMilliseconds < 10
      ? `00${remainingMilliseconds}`
      : remainingMilliseconds < 100
      ? `0${remainingMilliseconds}`
      : remainingMilliseconds.toString();

  // Create the formatted time string
  const formattedTime = `${minutes}:${secondsStr}.${millisecondsStr}`;

  return <span>{formattedTime}</span>;
};

export const calculateRank = (player: LeaderBoardTimeEntry, data: LeaderBoardTimeEntry[], page: number): string => {

const playerIndex = data.findIndex((item) => item === player);

if (playerIndex === -1) {
    // Player not found in the sorted array
    return "N/A";
}

let rank = playerIndex + 1 + ((page-1)*100);

// Check for ties by finding the number of players with the same time
let tieCount = 0;
for (let i = playerIndex - 1; i >= 0; i--) {
    if (
      data[i].time.runTime === player.time.runTime
    ) {
    tieCount++;
    } else {
    break; // Break when encountering the first different time
    }
}

// Adjust rank for ties
if (tieCount > 0) {
    rank -= tieCount;
    let result = `${rank}`;

    if(rank !== 10) {
      result += " "; //add extra space to make table width consistent (there will effectively always be 1 double character rank)
    }
    return result
}

return rank.toString();
};

export const calculateAFRank = (player: AFChartRow, data: AFChartRow[]): string => {

const playerIndex = data.findIndex((item) => item === player);

if (playerIndex === -1) {
    // Player not found in the sorted array
    return "N/A";
}

let rank = playerIndex + 1;

// Check for ties by finding the number of players with the same time
let tieCount = 0;
for (let i = playerIndex - 1; i >= 0; i--) {
    if (
      data[i].af === player.af
    ) {
    tieCount++;
    } else {
    break; // Break when encountering the first different time
    }
}

// Adjust rank for ties
if (tieCount > 0) {
    rank -= tieCount;
    let result = `${rank}`;

    if(rank !== 10) {
      result += " "; //add extra space to make table width consistent (there will effectively always be 1 double character rank)
    }
    return result
}

return rank.toString();
};

export const calculatePRSRRank = (player: PRSRChartRow, data: PRSRChartRow[]): string => {

const playerIndex = data.findIndex((item) => item === player);

if (playerIndex === -1) {
    // Player not found in the sorted array
    return "N/A";
}

let rank = playerIndex + 1;

// Check for ties by finding the number of players with the same time
let tieCount = 0;
for (let i = playerIndex - 1; i >= 0; i--) {
    if (
      data[i].prsr === player.prsr
    ) {
    tieCount++;
    } else {
    break; // Break when encountering the first different time
    }
}

// Adjust rank for ties
if (tieCount > 0) {
    rank -= tieCount;
    let result = `${rank}`;

    if(rank !== 10) {
      result += " "; //add extra space to make table width consistent (there will effectively always be 1 double character rank)
    }
    return result
}

return rank.toString();
};

export const calculateTotalTimeRank = (player: TotalTimeChartRow, data: TotalTimeChartRow[]): string => {

const playerIndex = data.findIndex((item) => item === player);

if (playerIndex === -1) {
    // Player not found in the sorted array
    return "N/A";
}

let rank = playerIndex + 1;

// Check for ties by finding the number of players with the same time
let tieCount = 0;
for (let i = playerIndex - 1; i >= 0; i--) {
    if (
      data[i].totalTime === player.totalTime
    ) {
    tieCount++;
    } else {
    break; // Break when encountering the first different time
    }
}

// Adjust rank for ties
if (tieCount > 0) {
    rank -= tieCount;
    let result = `${rank}`;

    if(rank !== 10) {
      result += " "; //add extra space to make table width consistent (there will effectively always be 1 double character rank)
    }
    return result
}

return rank.toString();
};

export const calculateLeaderboardRank = (player: LeaderboardChartRow, data: LeaderboardChartRow[]): string => {

const playerIndex = data.findIndex((item) => item === player);

if (playerIndex === -1) {
    // Player not found in the sorted array
    return "N/A";
}

let rank = playerIndex + 1;

// Check for ties by finding the number of players with the same time
let tieCount = 0;
for (let i = playerIndex - 1; i >= 0; i--) {
    if (
      data[i].tally === player.tally
    ) {
    tieCount++;
    } else {
    break; // Break when encountering the first different time
    }
}

// Adjust rank for ties
if (tieCount > 0) {
    rank -= tieCount;
    let result = `${rank}`;

    if(rank !== 10) {
      result += " "; //add extra space to make table width consistent (there will effectively always be 1 double character rank)
    }
    return result
}

return rank.toString();
};