import * as React from "react";
import { useRoutes, useNavigate } from "react-router-dom";
import { Layout } from "../views/layout";
import Home from "../views/home"
import { Setout } from "../views/setout"
import { Edit } from '../views/edit';
import { Game } from "../views/game";
import { LoadingPage } from '../views/loading'
import { Welcome } from '../views/welcome';
import { Rank } from '../views/rank';

const RedirectToHome = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate('home');
    }, [navigate]);

    return null;
};
const GetRouters = () => {
    return useRoutes([
        {
            path: "/",
            element: <Layout/>,
            children: [
                {
                    path: '/',
                    element: <RedirectToHome />,
                },
                {
                    path: "home",
                    element: <Home/>
                },
                {
                    path: "setout/:level",
                    element: <Setout/>
                },
                {
                    path: "edit",
                    element: <Edit/>
                },
                {
                    path: "game/:tokenId",
                    element: <Game/>
                },
                {
                    path: "loading/:tokenId",
                    element: <LoadingPage/>
                },
                {
                    path: 'welcome',
                    element: <Welcome/>
                },
                {
                    path: 'leaderboard',
                    element: <Rank/>
                }
            ]
        }
    ])
}
export default GetRouters