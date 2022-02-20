export interface GameData {
    id: number;
    date: string;
    home_team_score: number;
    visitor_team_score: number;
    season: number;
    period: number;
    status: string;
    time: string;
    postseason: boolean;
    home_team: TeamData;
    visitor_team: TeamData;
  }

export interface TeamData {
id: number;
abbreviation: string;
city: string;
conference: string;
division: string;
full_name: string;
name: string;
}
