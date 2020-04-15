export const SERVER_PATH = 'http://localhost:8081'; // 'http://89.208.199.170:8081'

export const API = '/api/v1';

export const RESPONSE = {
    OK: 200,
    OK_ADDED: 201,
    BAD_REQUEST: 400,
    UNAUTH: 401,
    NO_ACCESS_RIGHT: 403,
    EXISTS: 409,
    SERVER_ERROR: 500,
};

export const DOM = {
    CONTENT: 'l-content',
    PLAYER: 'l-player',
    NAVBAR: 'l-navbar',
};

export const URL = {
    MAIN: '/',
    NAVBAR: 'navbar',
    PLAYER: 'player',
    LOGIN: '/login',
    SIGN_UP: '/signup',
    PROFILE: '/profile',
    PROFILE_TRACKS: '/profile/tracks',
    PROFILE_ALBUMS: '/profile/albums',
    PROFILE_PLAYLISTS: '/profile/playlists',
    PROFILE_ARTISTS: '/profile/artists',
    SETTINGS: '/settings',
    ARTIST: /(\/artist\/)[0-9]+(\/albums|\/tracks|\/info)*/,
    PLAYLIST: /(\/playlist\/)[0-9]+/,
    ALBUM: /(\/album\/)[0-9]+/,
};

export const PAGINATION = {
    ALBUMS: 20,
    TRACKS: 50,
};

export const VALIDATION = {
    EMAIL_EMPTY: 'Enter email',
    EMAIL_INCORRECT: 'Incorrect email syntax',
    LOGIN_EMPTY: 'Enter login',
    LOGIN_INCORRECT: 'Login must contain at least 3 letters or numbers',
    PASS_EMPTY: 'Enter password',
    REPEAT_PASS_EMPTY: 'Repeat the password',
    PASSES_DIFF: 'Passwords must match',
    PASS_INCORRECT: 'Password must contain at least 3 letters or numbers',
    IMG_TOO_BIG: 'Max allowable size - 1Mb',
    IMG_WRONG_EXT: 'Allowable extensions - png, jpg, jpeg, gif',
    REGEX_EMAIL: '(.)+@(.)+',
    REGEX_LOGIN: '^[a-zA-Z0-9_.]{3,}$',
    REGEX_PASSWORD: '^[a-zA-Z0-9]{3,}$',
    ALLOWABLE_EXTENSIONS: ['png', 'jpg', 'jpeg', 'gif'],
};

export const GLOBAL = {
    GET_ARTIST_TRACKS: 'global-get-artist-tracks',
    PLAY_ARTIST_TRACKS: 'global-play-artist-tracks',
    PLAY_PLAYLIST_TRACKS: 'global-play-playlist-tracks',
    PLAY_ALBUM_TRACKS: 'global-play-album-tracks',
    PLAY_PLAYLIST: 'global-play-playlist',
    CLEAR_AND_LOCK: 'global-clear-and-lock',
    PLAY_ALBUM: 'global-play-album',
    COLLAPSE: 'global-collapse',
    REDIRECT: 'global-redirect',
};

export const MAIN = {
    GET_LIST_DATA: 'get-all-artists-data',
    RENDER_ARTIST_LIST: 'render-artist-list',
    NO_ANSWER: 'no-answer',
    REDIRECT: 'redirect',
};

export const LOGIN = {
    REDIRECT: 'login-redirect',
    INVALID: 'login-invalid',
    SUBMIT: 'login-submit',
    LOGIN_SUCCESS: 'login-success',
};

export const NAVBAR = {
    HEIGHT: 55,
    LOGIN_SUCCESS: 'navbar-login-success',
    CHECK_COOKIE: 'navbar-check-cookie',
    DRAW_COOKIE_RESULT: 'navbar-draw-cookie-result',
    RENDER_LOGGED: 'navbar-logged-in',
    RENDER_NOT_LOGGED: 'navbar-guest',
    GET_USER_DATA: 'navbar-get-user-data',
    LOGOUT_REDIRECT: 'navbar-logout-redirect',
    LOGOUT_CLICKED: 'navbar-logout-clicked',
};

export const PLAYER = {
    REDIRECT: 'player-redirect',
    GET_TRACK: 'player-get-track',
    GET_TRACKS: 'player-get-tracks',
    RESIZE: 'player-resize',
    PAUSE: 'player-pause',
    PLAY: 'player-play',
    PREVIOUS: 'player-previous-track',
    NEXT: 'player-next-track',
    REWIND: 'player-rewind',
    SHUFFLE: 'player-shuffle',
    UNSHUFFLE: 'player-unshuffle',
    REPEAT: 'player-repeat',
    REPEAT_ONE: 'player-repeat-one',
    UNREPEAT: 'player-unrepeat',
    MUTE: 'player-mute',
    UNMUTE: 'player-unmute',
    DELETE: 'player-delete',
    LIKE: 'player-like',
    ADD: 'player-add',
    DRAW_PLAY: 'player-draw-play',
    DRAW_PAUSE: 'player-draw-pause',
    TRACK_UPDATE: 'player-track-update',
    MOVE_MARKER: 'player-move-marker',
    DRAW_TRACKLIST: 'player-draw-tracklist',
    REMOVE_FROM_TRACKLIST: 'player-remove-from-tracklist',
    REMOVE_FROM_TRACKLIST_ALL: 'player-remove-from-tracklist-all',
    DRAW_TIMELINE: 'player-draw-timeline',
    DRAW_SHUFFLE: 'player-draw-shuffle',
    DRAW_UNSHUFLE: 'player-draw-unshuffle',
    DRAW_REPEAT: 'player-draw-repeat',
    DRAW_REPEAT_ONE: 'player-draw-repeat-one',
    DRAW_UNREPEAT: 'player-draw-unrepeat',
    DRAW_MUTE: 'player-draw-mute',
    DRAW_UNMUTE: 'player-draw-unmute',
};

export const SETTINGS = {
    GET_USER_DATA: 'settings-get-user-data',
    GET_CSRF_TOKEN: 'settings-get-csrf-token',
    RENDER_LOGGED: 'settings-logged-in',
    AVATAR_UPLOAD: 'settings-avatar-upload',
    SUBMIT: 'settings-submit',
    SUBMIT_PASSWORD: 'settings-submit-password',
    INVALID: 'settings-invalid',
    REDIRECT: 'settings-redirect',
};

export const SIGN_UP = {
    LOGIN_SUCCESS: 'signup-success',
    SUBMIT: 'signup-submit',
    INVALID: 'signup-invalid',
};

export const PROFILE = {
    SELECTED_CLASS: 'profile-is-touched-profile-section',
    ID_TRACKS_SECTION: 'profile-tracks-title',
    ID_PLAYLISTS_SECTION: 'profile-playlists-title',
    ID_ALBUMS_SECTION: 'profile-albums-title',
    ID_ARTISTS_SECTION: 'profile-artists-title',
    NO_ANSWER: 'profile-no-answer',
    REDIRECT: 'profile-redirect',
    GET_DATA: 'profile-get-profile-data',
    GET_STAT: 'profile-get-profile-stat',
    RENDER_DATA: 'profile-render-profile-data',
    RENDER_STAT: 'profile-render-profile-stat',
    CHOOSE_SECTION: 'profile-choose-section',
    RENDER_TRACKS: 'profile-render-profile-tracks',
    RENDER_PLAYLISTS: 'profile-render-profile-playlists',
    RENDER_ALBUMS: 'profile-render-profile-albums',
    RENDER_ARTISTS: 'profile-render-profile-artists',
};

export const ARTIST = {
    SET_ID: 'artist-set-id',
    ID_TRACKS_SECTION: 'tracks',
    ID_ALBUMS_SECTION: 'albums',
    ID_INFO_SECTION: 'info',
    NO_ANSWER: 'artist-no-answer',
    REDIRECT: 'artist-redirect',
    GET_DATA: 'artist-get-artist-data',
    RENDER_DATA: 'artist-render-artist-data',
    RENDER_TRACKS: 'artist-render-tracks',
    RENDER_ALBUMS: 'artist-render-albums',
    RENDER_INFO: 'artist-render-info',
};

export const PLAYLIST = {
    REDIRECT: 'playlist-redirect',
    GET_PLAYLIST_DATA: 'playlist-get-playlist-data',
    GET_TRACKS_DATA: 'playlist-get-tracks-data',
    RENDER_DATA: 'playlist-render-playlist',
    RENDER_PLAYLIST_DATA: 'playlist-render-playlist-data',
    RENDER_TRACKS_DATA: 'playlist-render-tracks-data',
    ERROR: 'playlist-show-errors',
};

export const ALBUM = {
    REDIRECT: 'album-redirect',
    GET_ALBUM_DATA: 'album-get-album-data',
    GET_TRACKS_DATA: 'album-get-tracks-data',
    RENDER_ALBUM_DATA: 'album-render-album',
    RENDER_TRACKS_DATA: 'album-render-tracks',
    ERROR: 'album-show-errors',
};
