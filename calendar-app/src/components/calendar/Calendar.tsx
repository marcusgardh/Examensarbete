import React, { useEffect, useState } from 'react';
import './Calendar.scss';
import Day from '../../models/Day';
import PrintCalendar from '../print-calendar/PrintCalendar';
import ChangeCalendar from '../change-calendar/ChangeCalendar';
import axios from 'axios';
import Entry from '../../models/Entry';

export interface ICalendar {
    token: boolean;
    validate(): void;
}

export default function Calendar(props: ICalendar) {
    const today: Date = new Date();
    const defaultMonth: number = today.getMonth();
    const defaultYear: number = today.getFullYear();
    const [currentMonth, setMonth] = useState(defaultMonth);
    const [currentYear, setYear] = useState(defaultYear);
    const months: Array<string> = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
    const defaultEntries: Entry[] = [];
    const [entries, setEntries] = useState(defaultEntries);
    const [days, setDays] = useState(showCalendar(currentMonth, currentYear));
    const [settingsFetched, setSettingsFetched] = useState(false);
    const [entriesFetched, setEntriesFetched] = useState(false);
    const [firstDay, setFirstDay] = useState(true);
    const defaultFont: string = '';
    const defaultColor: string = '';
    const defaultBorder: string = 'border-solid';
    const [font, setFont] = useState(defaultFont);
    const [color, setColor] = useState(defaultColor);
    const [border, setBorder] = useState(defaultBorder);

    // function that checks how many days and user entries are in the selected month and looks for the starting day, 
    // then returns an array with the days and entries
    function showCalendar(month: number, year: number) {

        let startingDay: number = (new Date(year, month)).getDay();

        let daysOfTheMonth: number = daysInMonth(month, year);

        let listOfDays: Day[] = []; 
        for (let i: number = 0; i < daysOfTheMonth; i++) {
            let day: Day = new Day();
            day.date = i + 1;
            if (startingDay === 0) {
                day.day = 7;    
            }
            else {
                day.day = startingDay;
            }

            startingDay++;
            if (startingDay > 6) {
                startingDay = 0;
            }
            
            for (let j: number = 0; j < entries.length; j++) {
                if(entries[j].day === i) {
                    day.text.push(entries[j].text);
                }
            }

            listOfDays.push(day);
        }
        return listOfDays;
    }    

    // function that calculates the days of the selected month and returns the number
    function daysInMonth(month: number, year: number) {
        let number: number = 32 - new Date(year, month, 32).getDate();
        return number;
    }

    function updateFirstDay(boolean: boolean) {
        setFirstDay(boolean);
    }

    // function that checks to see if user is changing month and then updates calendar
    function updateCalendar(month: number, year: number) {
        setMonth(month);
        setYear(year);
        setDays([...showCalendar(month, year)]);
        setEntriesFetched(false);
        updateFirstDay(true);
    }

    // call to backend that tries to fetch user customization settings if user is logged in,
    // otherwise it sets the settings to standard settings
    useEffect(() => {
        const fetchData: VoidFunction = async () => {
            if (!props.token) {
                setSettingsFetched(false);
            }

            if (!settingsFetched) {
                if (props.token) {
                    axios.get('/api/customization/get').then(
                        response => {
                            setFont(response.data.font);
                            setColor(response.data.color);
                            setBorder(response.data.border);
                        }
                    ).catch(
                        () => {
                            setFont(defaultFont);
                            setColor(defaultColor);
                            setBorder(defaultBorder);
                        }
                    );

                    setSettingsFetched(true);
                }

                else {
                    setFont(defaultFont);
                    setColor(defaultColor);
                    setBorder(defaultBorder)
                }
            }
        }
        fetchData();
    }, [settingsFetched, props.token]);

    // call to backend that tries to fetch user entries if user is logged in,
    // otherwise it returns an empty array
    useEffect(() => {
        const fetchData: VoidFunction = async () => {
            let result: Entry[] = []; 
            
            if (!props.token) {
                setEntriesFetched(false);
            }

            if (!entriesFetched) {

                if (props.token) {             
                    await axios.get('/api/entry/get/' + currentMonth + '/' + currentYear).then(
                        response => {
                            for (let i = 0; i < response.data.length; i++) {
                                result.push({id: response.data[i]._id, day: response.data[i].day,text: response.data[i].text});
                            }
                            setEntries(result);
                        }
                    ).catch(
                        () => {
                            setEntries(result);
                        }
                    )
                            
                    setEntriesFetched(true);
                }

                else {
                    setEntries(result);
                }

            }
        }
        fetchData();
    }, [currentMonth, currentYear, props.token, entriesFetched]);

    // call to backend that tries to send a user-written entry to the backend
    function postNewEntry(text: string, year: number, month: number, day: number) {
        axios.post('/api/entry/post', {text: text, year: year, month: month, day: day}).then(
            () => {
                setDays([...showCalendar(month, year)]);
                setEntriesFetched(false);
            }
        ).catch(
            () => {
                setDays([...showCalendar(month, year)]);
                setEntriesFetched(false);
            }
        );
    }

    // call to backend that tries to delete a user-written entry from the backend
    function deleteEntry(id: number) {
        axios.delete('/api/entry/delete/' + id).then(
            () => {
                setDays([...showCalendar(currentMonth, currentYear)]);
                setEntriesFetched(false);
            }
        ).catch(
            () => {
                setDays([...showCalendar(currentMonth, currentYear)]);
                setEntriesFetched(false);
            }
        );
    }

    return (
        <React.Fragment>
            <h1 className={font}>{months[currentMonth]} {currentYear}</h1>
            <ChangeCalendar goBack={updateCalendar} goForward={updateCalendar} month={currentMonth} year={currentYear}></ChangeCalendar>
            <PrintCalendar days={days} entries={entries} month={currentMonth} year={currentYear} createNewEntry={postNewEntry} deleteEntry={deleteEntry} font={font} color={color} border={border} token={props.token} validate={props.validate} firstDay={firstDay} updateFirstDay={updateFirstDay}></PrintCalendar>           
        </React.Fragment>
        )
}