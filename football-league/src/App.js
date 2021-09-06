import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import League from './League/League';
import TeamsList from './TeamsList/TeamsList';
import TeamCalendar from './TeamCalendar/TeamCalendar';
import LeagueCalendar from './LeagueСalendar/LeagueCalendar';

function App() {
  let location = useLocation();
  let background = location.state && location.state.background;

  return (    
      <Switch location={background || location}>
        <Route exact path="/" children={<League />} />        
        <Route path="/competitions/:id/teams" children={<TeamsList />} />        
        <Route path="/teams/:id/matches" children={<TeamCalendar />} />    
        <Route path="/competitions/:id/matches" children={<LeagueCalendar />} />    
      </Switch>
  );
}

export default App;
