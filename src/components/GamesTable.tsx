import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { GameData } from "../interfaces/GameData";

export default function GamesTable(props: { games: GameData[] }) {
    const removeTimestampFromDate = (datestr: string): string => datestr.split('T')[0]
    const constructGameKey = (game: GameData): string => game["home_team"]["abbreviation"] + game["visitor_team"]["abbreviation"] + game["date"]
    const toKebabCase = (s: string): string => s.toLowerCase().replaceAll(' ', '-');
    const constructGameLink = (game: GameData): string => `https://nbareplay.net/category/${toKebabCase(game["home_team"]["full_name"])}`
    const getScoreDifferential = (game: GameData): number => Math.abs(game["home_team_score"]-game["visitor_team_score"])

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Game</strong></TableCell>
                        <TableCell align="center"><strong>Score Differential</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.games.map((game: GameData) =>

                        <TableRow hover key={constructGameKey(game)}>
                            <TableCell>{removeTimestampFromDate(game["date"])}</TableCell>
                            <TableCell>
                                <Link href={constructGameLink(game)} underline="none" color="white">
                                    {game["home_team"]["full_name"]} vs {game["visitor_team"]["full_name"]}
                                </Link>
                            </TableCell>
                            <TableCell align="center">{getScoreDifferential(game)}</TableCell>
                        </TableRow>
                    )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

