import { useState } from "react";
import { useRecoilState } from "recoil";
import { client } from "~/flopClient";
import { playerState } from "~/state";
import usePlayerDetails from "./usePlayerDetails";

const useSpotifyAuthorization = () => {
    const [authUrl, setAuthUrl] = useState<string | null>(null);
    const { playerDetails } = usePlayerDetails();
    const [player] = useRecoilState(playerState);

    let state: "offline" | "connected" | "other-player-connected" = "offline";
    if (player.spotifyPlayerId === null) {
        state = "offline";
    }
    if (player.spotifyPlayerId === playerDetails.id) {
        state = "connected";
    }
    if (player.spotifyPlayerId !== null && player.spotifyPlayerId !== playerDetails.id) {
        state = "other-player-connected";
    }

    const generateRandomString = (length: number) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const getSpotifyAuthUrl = () => {
        const clientId = '19c4a6309e804c548b4b2a7e76b66cf0'; // TODO change to configurable value
        const redirectUri = 'http://0.0.0.0:8080/spotifyredirect'; // TODO change to configurable value

        // See scopes at: https://developer.spotify.com/documentation/web-api/concepts/scopes#app-remote-control
        const scope = 'user-read-private user-read-email streaming';
        const state = generateRandomString(16);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope,
            redirect_uri: redirectUri,
            state,
            show_dialog: 'true',
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    };

    const handleLogin = () => {
        const url = getSpotifyAuthUrl();
        setAuthUrl(url);
        window.location.href = url;
    };

    const handleLogout = () => {
        client.POST('/api/v1/player/{player_id}/logoutspotify',
            {
                params: {
                    // @ts-expect-error - required for player_id path param
                    path: { player_id: playerDetails.id },
                },
            }
        )

    }

    const authSpotify = async (code: string) => {
        client
            .POST("/api/v1/player/{player_id}/authspotify", {
                body: {
                    code: code,
                },
                params: {
                    // @ts-expect-error - required for player_id path param
                    path: { player_id: playerDetails.id },
                },
            })
    }

    return { handleLogin, authUrl, handleLogout, state, authSpotify };
};
export default useSpotifyAuthorization;
