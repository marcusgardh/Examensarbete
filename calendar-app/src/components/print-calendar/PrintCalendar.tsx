import React, { useState } from 'react';
import Day from '../../models/Day';
import Entry from '../../models/Entry';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

export interface IPrintCalendar {
    days: Day[];
    entries: Entry[];
    month: number;
    year: number;
    createNewEntry(text: string, year: number, month: number, day: number): void;
    deleteEntry(id: number): void;
    font: string;
    color: string;
    border: string;
    token: boolean;
    validate(): void;
    firstDay: boolean;
    updateFirstDay(boolean: boolean): void;
}

export default function PrintCalendar(props: IPrintCalendar) {
    const daysOfTheWeek: Array<string> = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
    const daysOfTheWeekFull: Array<string> = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
    const [modal, setModal] = useState(false);
    const [modalNumber, setModalNumber] = useState(0);
    const [modalDay, setModalDay] = useState(0);
    const months: Array<string> = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

    // on render check if first day is monday,
    // otherwise add empty days to start of month-array to correct calendar start
    if (props.days[0].day !== 1 && props.firstDay) {
        props.updateFirstDay(false);
        const n: number = props.days[0].day - 1;

        for (let i = 0; i < n; i++) {
            let newEmptyDay: Day = new Day();
            newEmptyDay.date = -i; 
            newEmptyDay.day = 0;
            props.days.unshift(newEmptyDay);
        }
    }

    // on render check if amount of days are dividable by seven,
    // otherwise add empty days to end of month-array to correct calendar end
    if (props.days.length % 7 !== 0 ) {
        if (28 < props.days.length && 35 > props.days.length) {
            let n: number = 0; 
            const c: number = props.days.length;
            for (let i = 0; i < 35 - c; i++) {
                let newEmptyDay: Day = new Day();
                n++;
                newEmptyDay.date = c + n;
                newEmptyDay.day = 0;
                props.days.push(newEmptyDay);
            }
        }

        if (35 < props.days.length && 42 > props.days.length) {
            let n: number = 0; 
            const c: number = props.days.length;
            for (let i = 0; i < 42 - c; i++) {
                let newEmptyDay: Day = new Day();
                n++;
                newEmptyDay.date = c + n;
                newEmptyDay.day = 0;
                props.days.push(newEmptyDay);
            }
        }
    }

    // function that takes in user-written entry and sends up to Calendar to post
    function sendEntry(day: number) {
        if (props.token) {
            let text = prompt('Vad vill du skriva?') || '';
            props.createNewEntry(text, props.year, props.month, day);
        }
    }

    // function that takes user-selected entry and sends up to Calendar to delete
    function deleteEntry(id: number) {
        if (props.token) {
            props.deleteEntry(id);
        }
    }

    // function that opens day-selected modal
    function openModal() {
        setModal(true);
    }

    // function that closes day-selected modal
    function closeModal() {
        setModal(false);
    }

    // on render map out month-array to html-elements and give each day a modal,
    // if day is empty make it an empty square that is not clickable
    let calendarElements = props.days.map((day: Day) => {
        if (day.day === 0) {
            return (
                <div key={day.date} className={props.border + ' ' + props.color + '-inactive day'}></div>
            );
        }

        return (
            <div key={day.date} onClick={()=>{openModal();setModalDay(day.day - 1); setModalNumber(day.date); props.validate()}} className={props.border + ' ' + props.color + ' day active-day'}>
                <p className='day-text'>{daysOfTheWeek[day.day - 1]} {day.date}</p>
                {entryFunction(day.date, false)}
            </div>
        );
    
    });

    // function that prints out user-written entries to calendar, 
    // if dayview is true print out every entry of selected day,
    // otherwise print out the first entry of selected day
    function entryFunction(date: number, dayView: boolean) {
        let entryElements: (JSX.Element | null)[] = [];

        if (dayView) {
            let i: number = 0;
            entryElements = props.entries.map((entry: Entry) => {
                
                if (entry.day === date) {
                    i++;
                    if (i === 1) {
                        return <div className='top-entry' key={i}><div><span>{entry.text}</span></div><div><button onClick={()=>{deleteEntry(entry.id)}}>X</button></div></div>;
                    }

                    else {
                        return <div className='entry' key={i}><div><span>{entry.text}</span></div><div><button onClick={()=>{deleteEntry(entry.id)}}>X</button></div></div>;
                    }
                
                }
                
                return null;
            })
        }

        else {

            
            let i: number = 0;
            entryElements = props.entries.map((entry: Entry) => {
                
                if (entry.day === date) {
                    i++;
                    
                    if (i >= 2 && i < 3) {
                        return <p key={i}>och mer...</p>;
                    }
                    if(i === 1) {
                        let text =
                        entry.text.length > 20
                        ? entry.text.substring(0, 20)
                        : entry.text;
                        text = text.length === 20
                        ? text.substring(0,
                            Math.min(text.length, text.lastIndexOf(' '))    
                            ) + '...'
                            : text;
                        return <p key={i}>{text}</p>;
                    }
                }
                
                return null;
            })
        
        }

        return entryElements;
    }

    return (
        <div id='calendar-area'>
            <Modal show={modal} onHide={closeModal} animation={false}>
                <Modal.Header>{daysOfTheWeekFull[modalDay] + ' ' + modalNumber + ' ' + months[props.month] + ' ' + props.year}</Modal.Header>
                <Modal.Body>
                    <div className='entries'>
                        {props.token ? entryFunction(modalNumber, true) : 'Logga in för att kunna använda den här funktionen'}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={closeModal}>Stäng</button>
                    <button onClick={()=>{sendEntry(modalNumber)}}>Ny aktivitet</button>
                </Modal.Footer>
            </Modal>
            <div id='calendar' className={props.font}>
                {calendarElements}
            </div>
        </div>
    );
}