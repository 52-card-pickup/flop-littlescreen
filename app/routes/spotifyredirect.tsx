import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import usePlayerDetails from "~/hooks/usePlayerDetails";
import useSpotifyAuthorization from "~/hooks/useSpotifyAuthorization";

export default function SpotifyRedirect() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { playerDetails } = usePlayerDetails();
    const { authSpotify } = useSpotifyAuthorization();

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            return;
        }
        if (!playerDetails.id) {
            return;
        }
        authSpotify(code).finally(() => {
            navigate("/game");
        })
    }, [playerDetails]);


    return null;
}
