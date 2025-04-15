import { isAfter, isBefore, isEqual } from "date-fns";

export const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
};

export const generateNumberId = (existingData = []) => {
    const existingIds = new Set(existingData?.map(data => data.id));
    let newId;

    do {
        newId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    } while (existingIds.has(newId));

    return newId;
};

export const CheckTournamentIsRunning = (startDate, endDate) => {
    const now = new Date();
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    if (isBefore(now, startDateObj)) {
        return 'upcoming';
    }
    if (isAfter(now, endDateObj)) {
        return 'completed';
    }
    if (isEqual(now, startDateObj) || (isAfter(now, startDateObj) || isBefore(now, endDateObj))) {
        return 'live';
    }

    return 'unknown';
};

export const CheckMatchIsRunning = (eventDate) => {
    const now = new Date();
    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0)

    if (isBefore(eventDateObj, now)) {
        return 'completed';
    }
    if (isAfter(eventDateObj, now)) {
        return 'upcoming';
    }
    if (isEqual(eventDateObj, now)) {
        return 'live';
    }
}

export const matchWithOrder = (data) => {
    const live_match = []
    const upcomming_match = []
    const completed_match = []
    if (data && data.length > 0) {
        data?.forEach((item) => {
            let matchStatus = CheckMatchIsRunning(item?.datetime)
            if (matchStatus === 'live') {
                live_match.push(item)
            } else if (matchStatus === 'upcoming') {
                upcomming_match.push(item)
            } else if (matchStatus === 'completed') {
                completed_match.push(item)
            }
        })
        let matchWithOrder = [...live_match, ...upcomming_match, ...completed_match]
        return matchWithOrder
    }
}

export const colorCode = {
    'completed': 'success',
    'upcoming': 'warning',
    'live': 'error'
}

export const DateFormat = (dateVal) => {
    const dateString = dateVal;
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString();
    const formattedDate = `${day < 10 ? `0${day}` : day}-${month}-${year}`;
    return formattedDate
};

export const dateTimeFormate = (dateVal) => {
    const date = new Date(dateVal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    return formattedDate
}

export const generatePair = (arr, groupArr, val1 = 'obj1', val2 = 'obj2', groupName = '') => {
    const result = [];
    const arrObj = arr.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
    }, {});
    for (let i = 0; i < groupArr.length - 1; i++) {
        for (let j = i + 1; j < groupArr.length; j++) {
            let id1 = groupArr[i];
            let id2 = groupArr[j];
            if (arrObj[id1] && arrObj[id2]) {
                result.push({ [val1]: arrObj[id1], [val2]: arrObj[id2], groupName });
            }
        }
    }
    return result;
};

export function multiplyArray(arr, times) {
    let result = [];
    for (let i = 0; i < times; i++) {
        result = result.concat(arr);
    }
    return result;
}

export const scrollTopDiv = (className) => {
    let doc = document.getElementsByClassName(className)[0]
    if (doc) {
        doc.scrollTop = 0;
    }
}

export const scrollBottomDiv = (className) => {
    const doc = document.getElementsByClassName(className)[0];
    if (doc) {
        doc.scrollTop = document.body.scrollHeight;
    }
};

export const leaderBoardShorting = (players, type) => {
    return players.sort((a, b) => {
        if (type !== 1) {
            const runsDiff = b.battingruns - a.battingruns;
            if (runsDiff !== 0) return runsDiff;

            return b.battingballs === 0 ? 0 : (b.battingruns / b.battingballs) - (a.battingruns / a.battingballs);
        } else if (type === 1) {
            const bowlingWicketsDiff = b.bowlingwickets - a.bowlingwickets;
            if (bowlingWicketsDiff !== 0) return bowlingWicketsDiff;
            if (a.bowlingwickets === 0 && a.bowlingruns === 0 && b.bowlingwickets === 0 && b.bowlingruns === 0) {
                return 0;
            }
            if (a.bowlingwickets === 0 && a.bowlingruns === 0) return 1;
            if (b.bowlingwickets === 0 && b.bowlingruns === 0) return -1;
            const ecoA = a.bowlingruns / (a.bowlingballs / 6);
            const ecoB = b.bowlingruns / (b.bowlingballs / 6);
            if (ecoA !== ecoB) {
                return ecoA - ecoB;
            }
            return 0;

            // const ecoDiff = (a.bowlingruns / a.bowlingovers) - (b.bowlingruns / b.bowlingovers);
            // return ecoDiff;
        }
    });
};


export const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};


export const calculateMVPPoints = (player, wickets, economy, team1, team2, winnerTeam, firsteconomy) => {
    if (!player || !team1 || !team2) return null;

    let battingPoints = 0, bowlingPoints = 0, fieldingPoints = 0;
    let battingrun = 0, bowlingrun = 0, battingball = 0, bowlingball = 0;
    let four = 0, six = 0, sr = 0, eco = 0, maiden = 0, over = 0, bowlerwickets = 0;

    // Determine team details
    const isTeam1 = team1?.id === player.teamId;
    const team = isTeam1 ? team1?.team_name : team2?.team_name;
    const teamletter = isTeam1 ? team1?.letter : team2?.letter;
    const teamcolor = isTeam1 ? team1?.team_color : team2?.team_color;
    const teamthumbnail = isTeam1 ? team1?.team_logo : team2?.team_logo;
    const playerthumbnail = player?.playerImage;

    // **Batting Points Calculation**
    const playerscores = wickets?.filter(wicket => wicket.BatterId === player.id) || [];

    playerscores.forEach(wicket => {
        const runs = parseInt(wicket.run) || 0;
        const balls = parseInt(wicket.balls) || 0;
        const fours = parseInt(wicket.four) || 0;
        const sixes = parseInt(wicket.six) || 0;

        battingrun += runs;
        battingball += balls;
        four += fours;
        six += sixes;

        // Boundary points
        battingPoints += fours + 2 * sixes;
        let isWinnerPlayer = player?.teamId === winnerTeam?.id && player?.id === wicket?.BatterId && wicket

        if (isWinnerPlayer) {
            battingPoints += isWinnerPlayer?.reason === "Not Out" ? 10 : 5
            bowlingPoints += 5
        }
    });

    sr = battingrun && battingball ? ((battingrun / battingball) * 100).toFixed(2) : 0;

    // Points calculations
    battingPoints += Math.floor(battingrun / 2);
    if (battingrun >= 50 && battingrun < 100) battingPoints += 5;
    if (battingrun >= 100) battingPoints += 10;

    // Strike rate points
    if (sr >= 80 && sr < 100) battingPoints += 2;
    if (sr > 100) battingPoints += 4;

    // **Bowling Points Calculation**
    const firstBowlingTotalScore = firsteconomy?.filter(data => data.bowlerId === player.id) || [];
    const bowlerTotalScore = economy?.filter(data => data.bowlerId === player.id) || [];

    bowlerTotalScore.forEach(bowler => {
        // bowlingrun = bowler.bowlerrun || 0;
        // bowlerwickets = bowler.bowlerwicket || 0;
        bowlingball += bowler.legalBall || 0;
    });

    firstBowlingTotalScore.forEach(bowler => {
        // bowlingrun = bowler.bowlerrun || 0;
        // bowlerwickets = bowler.bowlerwicket || 0;
        bowlingball += bowler.legalBall || 0;
    });

    if (bowlerTotalScore.length > 0) {
        let lastBowler = bowlerTotalScore[bowlerTotalScore.length - 1];
        bowlingrun += lastBowler.bowlerrun || 0;
        bowlerwickets += lastBowler.bowlerwicket || 0;
    }

    if (firstBowlingTotalScore.length > 0) {
        let lastBowler = firstBowlingTotalScore[firstBowlingTotalScore.length - 1];
        bowlingrun += lastBowler.bowlerrun || 0;
        bowlerwickets += lastBowler.bowlerwicket || 0;
    }

    // over = bowlerTotalScore.reduce((totalOvers, data) => {
    //     console.log(data);

    //     return !data.legalBall ? 0 : totalOvers > 0 ? totalOvers + (data.legalBall === 6 ? 1 : data.legalBall / 10) : (bowlingball === 6 ? 1 : bowlingball / 10);
    // }, 0).toFixed(1);

    // over = (Math.floor(bowlingball / 6 * 10) / 10).toFixed(1)
    over = Math.floor(bowlingball / 6) + "." + (bowlingball % 6);
    bowlingPoints += bowlerwickets * 10;
    if (bowlerwickets >= 3 && bowlerwickets < 5) bowlingPoints += 5;
    if (bowlerwickets >= 5) bowlingPoints += 10;

    eco = (bowlingrun / over || 0).toFixed(2);
    if (eco < 2 && bowlingball > 0) bowlingPoints += 10;
    else if (eco <= 5 && bowlingball > 0) bowlingPoints += 8;
    else if (eco <= 7 && bowlingball > 0) bowlingPoints += 6;
    else if (eco <= 10 && bowlingball > 0) bowlingPoints += 4;
    else if (bowlingball > 0) bowlingPoints += 2;

    // **Maiden Over Calculation**
    bowlerTotalScore.forEach(bowlerScore => {
        const allZeroBalls = Object.keys(bowlerScore)
            .filter(key => !isNaN(key))
            .every(key => ["0", "W", "LB", "1LB", "2LB", "3LB", "4LB", "5LB", "6LB"].includes(bowlerScore[key]));

        if (allZeroBalls && bowlerScore?.legalBall === 6) maiden += 1;
    });

    firstBowlingTotalScore.forEach(bowlerScore => {
        const allZeroBalls = Object.keys(bowlerScore)
            .filter(key => !isNaN(key))
            .every(key => ["0", "W", "LB", "1LB", "2LB", "3LB", "4LB", "5LB", "6LB"].includes(bowlerScore[key]));

        if (allZeroBalls && bowlerScore?.legalBall === 6) maiden += 1;
    });

    bowlingPoints += maiden * 2;

    // **Fielding Points Calculation**
    const fieldingScore = wickets?.filter(wicket => wicket.fielder === player.id) || [];
    fieldingPoints += fieldingScore.length * 10;

    // **Final MVP Object**
    return {
        playerName: player.playerName,
        playerthumbnail,
        playerletter: player.letter,
        playercolor: player.playerColor,
        team,
        teamthumbnail,
        teamletter,
        teamcolor,
        battingrun,
        battingball,
        four,
        six,
        sr,
        bowlingrun,
        bowlingball,
        bowlerwickets,
        eco,
        maiden,
        over,
        bowlingPoints,
        battingPoints,
        fieldingPoints,
        totalPoints: battingPoints + bowlingPoints + fieldingPoints,
    };
};

function calculateResource(oversRemaining, totalOvers, wicketsLost) {
    const oversFactor = oversRemaining / totalOvers;
    const wicketsFactor = Math.pow(1 - (wicketsLost / 10), 2);
    return oversFactor * wicketsFactor * 100;
}

export function calculateDLSTarget(team1Score, team1Overs, team2Overs, team2Wickets) {
    // Calculate available resources for both teams
    const resTeam1 = calculateResource(team1Overs, team1Overs, 0);
    const resTeam2 = calculateResource(team2Overs, team1Overs, team2Wickets);

    // Calculate Revised Target
    const revisedTarget = Math.floor(team1Score * (resTeam2 / resTeam1)) + 1;
    return revisedTarget;
}

export function formatNumberShort(num, decimalPlaces = 1) {
    if (isNaN(num)) return '0'; // Handle non-numbers

    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (absNum < 1000) return num.toString(); // Return as-is for numbers under 1,000

    const units = [
        { value: 1e12, suffix: 'T' },
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' }
    ];

    for (let unit of units) {
        if (absNum >= unit.value) {
            const formattedNum = (absNum / unit.value).toFixed(decimalPlaces);
            
            // Remove trailing .0 if decimalPlaces is 1
            const cleanNum = decimalPlaces > 0 ?
            formattedNum.replace(/\.0+$|(\..+?)0+$/, '$1') :
            formattedNum;
            return sign + cleanNum + unit.suffix;
        }
    }

    return num.toString();
}