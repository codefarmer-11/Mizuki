import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "Secret Betrayal",
		artist: "北村友香,東京混声合唱団",
		cover: "assets/music/cover/Secret Betrayal.jpg",
		url: "assets/music/url/北村友香,東京混声合唱団 - Secret Betrayal.mp3",
		duration: 0,
	},
	{
		id: 2,
		title: "Delicate Weapon",
		artist: "Grimes,Lizzy Wizzy",
		cover: "assets/music/cover/Delicate Weapon.jpg",
		url: "assets/music/url/Grimes,Lizzy Wizzy - Delicate Weapon.mp3",
		duration: 0,
	},
	{
		id: 3,
		title: "Haunt Muskie",
		artist: "C418",
		cover: "assets/music/cover/Haunt Muskie.jpg",
		url: "assets/music/url/C418 - Haunt Muskie.mp3",
		duration: 0,
	},{
		id: 4,
		title: "Taswell",
		artist: "C418",
		cover: "assets/music/cover/Taswell.jpg",
		url: "assets/music/url/C418 - Taswell.mp3",
		duration: 0,
	}
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
