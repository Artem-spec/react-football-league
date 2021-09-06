import React from "react";
import './TeamCalendar.css'
export default class TeamCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
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
                    matches: result.matches
                }));
                this.resultAPI = result.matches;
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
    handleChange() {
        const inputFromDate = document.getElementById('from-date');
        const fromDate = new Date(inputFromDate.value);
        const inputToDate = document.getElementById('to-date');
        const toDate = new Date(inputToDate.value);
        let newState = [];
        if (inputFromDate.value !== '' && inputToDate.value !== '') {
            newState = this.resultAPI.filter(item => {
                let dateItem = new Date(item.utcDate);
                if (dateItem >= fromDate && dateItem <= toDate)
                    return true;
            })

        }
        else if (inputToDate.value !== '') {
            this.resultAPI.filter(item => {
                newState = this.resultAPI.filter(item => {
                    let dateItem = new Date(item.utcDate);
                    if (dateItem <= toDate)
                        return true;
                })
            })
        }
        else if (inputFromDate.value !== '') {
            newState = this.resultAPI.filter(item => {
                let dateItem = new Date(item.utcDate);
                if (dateItem >= fromDate)
                    return true;
            })
        }
        this.setState((prevState) => ({
            ...prevState,
            matches: newState
        }));
    }

    render() {
        let { matches, error } = this.state;
        matches.forEach(match => {
            const utcDate = new Date(match.utcDate);
            let day = utcDate.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            let month = utcDate.getMonth();
            month += 1;
            if (month < 10) {
                month = '0' + month;
            }
            const year = utcDate.getFullYear();
            const date = `${day}-${month}-${year}`;
            match.date = date;

        })
        if (error.message !== '') {
            return (<h1>{error.message}</h1>);
        }

        return (
            <div>
                <h1 className="heading-h1">Календарь команды</h1>
                <div className='range-date' id='range-date' onChange={this.handleChange} >
                    <input type='date' className='form-control' id='from-date'></input>
                    <span>-</span>
                    <input type='date' className='form-control' id='to-date'></input>
                </div>

                <ul className="row">
                    {matches.map(match =>
                    (<li key={match.id} className="col-md-4 card m-1">
                        <span>{match.awayTeam.name}</span>
                        <span>{match.homeTeam.name}</span>
                        <span>{match.score.fullTime.awayTeam} : {match.score.fullTime.homeTeam}</span>
                        ({match.status}) {match.date}
                    </li>
                    ))}
                </ul>
            </div>
        )
    }
}