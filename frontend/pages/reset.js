import { useRouter } from "next/dist/client/router";
import RequestReset from "../components/RequestReset";
import Reset from "../components/Reset";

export default function ResetPage({query}) {
    if (!query?.token)
        return (
            <div>
                <p>Sorry you must supply token</p>
                <RequestReset/>
            </div>
        );

    return (
        <div>
            <Reset token={query.token}/>
        </div>
    );
}
