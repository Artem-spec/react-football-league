import React from "react";
import '../bootstrap.min.css';
import { Link } from "react-router-dom";

export default class TeamsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            error: {
                name: '',
                message: ''
              }
        };
        this.resultAPI = [];
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        const TOKEN = 'eb749ad12020471a82aa311498dc7b4b';
        fetch(`https://api.football-data.org/v2${window.location.pathname}`, {
            headers: {
                'X-Auth-Token': TOKEN
            }
        })
            .then(res => {
                if (!res.ok) {
                    switch (res.status) {
                        case 403:
                            throw new Error(`Что-то пошло не так...${res.status} - Данные доступны в платной версии API`);
                        default:
                            throw new Error(`Что-то пошло не так...`);
                    }
                }
                return res.json();
            })
            .then((result) => {
                this.setState((prevState) => ({
                    ...prevState,
                    teams: result.teams,
                }));
                this.resultAPI = result.teams;
            })
            .catch(err => {
                this.setState((prevState) => ({
                    ...prevState,
                    error: {
                        name: err.name,
                        message: err.message
                    }
                }));
            });
    }
    handleChange(event) {
        let newState = this.resultAPI.filter(item => {
            let value = event.target.value.toLowerCase().trim();
            let name = item.name.toLowerCase().trim();
            if (name.startsWith(value)) {
                return true;
            }
        })
        this.setState((prevState) => ({
            ...prevState,
            teams: newState
        }));
    }
    render() {
        let { teams, error } = this.state;
        if (error.message !== '') {
            return (<h1>{error.message}</h1>);
        }
        return (
            <div>
                <h1 className="heading-h1">Список команд</h1>
                <input className='form-control filter' onChange={this.handleChange} placeholder='Фильтрация команд'></input>
                <ul className="row">
                    {teams.map(team => (
                        <li className="col-md-4 card m-1" key={team.id}>
                            <div className='logo-text'>
                                {team.name}
                                <img src={team.crestUrl} alt='' />
                            </div>
                            <div className='btn-group btn-gtoup-sm'>
                                <Link to={
                                    {
                                        pathname: `/teams/${team.id}/matches`
                                    }
                                } className='btn btn-success btn-card'>
                                    Матчи
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }


}