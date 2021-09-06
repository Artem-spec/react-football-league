import React from "react";
import '../bootstrap.min.css';
import './League.css';
import { Link } from "react-router-dom";

export default class League extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leagues: [],
            error: {}
        };
        this.resultAPI = [];
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const TOKEN = 'eb749ad12020471a82aa311498dc7b4b';
        fetch('https://api.football-data.org/v2/competitions', {
            method: 'GET',
            headers: {
                'X-Auth-Token': TOKEN
            },

        })
            .then(res => res.json())
            .then((result) => {
                this.setState((prevState) => ({
                    ...prevState,
                    leagues: result.competitions
                }));
                this.resultAPI = result.competitions;
            })
            .catch(err => {
                this.setState((prevState) => ({
                    ...prevState,
                    error: err
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
            leagues: newState
        }));
    }

    render() {
        let { leagues, error } = this.state;
        if (Object.keys(error).length !== 0) {
            return (<h1>{error.message}</h1>);
        }
        return (
            <div>
                <h1 className="heading-h1">Список лиг/соревнований</h1>
                <input className='form-control filter' onChange={this.handleChange} placeholder='Фильтрация лиг'></input>
                <ul className="row">
                    {leagues.map(league => (
                        <li className="col-md-4 card m-1" key={league.id}>
                            <div className='logo-text'>
                                {league.name}
                                <img src={league.emblemUrl} alt='' />
                            </div>
                            <div className='btn-group btn-gtoup-sm'>
                                <Link to={{
                                    pathname: `/competitions/${league.id}/teams`
                                }} className='btn btn-success btn-card'>
                                    Команды
                                </Link>
                                <Link to={{
                                    pathname: `/competitions/${league.id}/matches`
                                }} className='btn btn-success btn-card'>
                                    Матчи Лиги
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        );

    }
}