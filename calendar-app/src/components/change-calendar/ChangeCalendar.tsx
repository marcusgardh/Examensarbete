import React from 'react';

export interface IChangeCalendar {
    goBack(month: number, year: number): void;
    goForward(month: number, year: number): void;
    month: number;
    year: number;

}

export default function ChangeCalendar(props: IChangeCalendar) {

    // function that tells calendar to go back one month in time
    function goBack() {
        if (props.month <= 0) {
            props.goBack(11, props.year - 1)
        }
        
        else {
            props.goBack(props.month - 1, props.year)
        }
    }

    // function that tells calendar to go forward one month in time
    function goForward() {
        if (props.month + 1 > 11) {
            props.goForward(0, props.year + 1)
        }

        else {
            props.goForward(props.month + 1, props.year)
        }
    }

    return (
        <div id="change-calendar">
            <button onClick={goBack}>&#60;</button>
            <button onClick={goForward}>&#62;</button>
        </div>
    )
}