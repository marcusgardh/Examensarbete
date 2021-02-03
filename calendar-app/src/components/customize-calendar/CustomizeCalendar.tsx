import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import './CustomizeCalendar.scss';

export interface ICustomizeCalendar {
    token: boolean;
}

export default function CustomizeCalendar(props: ICustomizeCalendar) {
    const [font, setFont] = useState('');
    const [color, setColor] = useState('');
    const [border, setBorder] = useState('border-solid');
    const [fetched, setFetched] = useState(false);
    const [callback, setCallback] = useState(<p></p>)
    // function that updates user-selected font
    function updateFont(e: ChangeEvent<HTMLSelectElement>) {
        setFont(e.target.value);
    }
    
    // function that updates user-selected background color
    function updateColor(e: ChangeEvent<HTMLSelectElement>) {
        setColor(e.target.value);
    }

    // function that updates user-selected border
    function updateBorder(e: ChangeEvent<HTMLSelectElement>) {
        setBorder(e.target.value);
    }

    // function that tries to update users customization settings
    function saveSettings(e: FormEvent) {
        e.preventDefault();

        axios.put('/api/customization/update', {font: font, color: color, border: border}).then(
            () => {
                setFetched(false);
                setCallback(<p>Dina inställningar är sparade!</p>)
            }
        ).catch(
            () => {
                setFetched(false);
                setCallback(<p>Något gick fel</p>)
            }
        );
    }
    
    // call to backend that tries to update user-selected customization settings
    useEffect(() => {
        const fetchData: VoidFunction = async () => {
          
            if (!fetched) {
                if (props.token) {

                    axios.get('/api/customization/get').then(
                        response => {
                            setFont(response.data.font);
                            setColor(response.data.color);
                            setBorder(response.data.border);
                            setFetched(true);
                        }
                    ).catch(
                        () => {
                            setFont(font);
                            setColor(color);
                            setBorder(border);
                        }
                    );
                }                        
            }
        }
        fetchData();
    }, [fetched, props.token, font, color, border]);

    return (
        <div id='customize-area'>
            <form id='style-form' onSubmit={saveSettings}>
                <div className='radio'>
                    <div>
                        <label htmlFor='user-font'>Typsnitt</label> 
                    </div>
                    <div>
                        <select id='user-font' value={font} onChange={updateFont} name='user-font'>
                            <option className='font-standard' value=''>Standard</option>
                            <option className='font-times' value='font-times'>Times New Roman</option>
                            <option className='font-brush' value='font-brush'>Brush Script</option>
                            <option className='font-courier' value='font-courier'>Courier</option>
                            <option className='font-helvetica' value='font-helvetica'>Helvetica</option>
                        </select>
                    </div>
                </div>
                <div className='radio'>
                    <div>
                        <label htmlFor='user-color'>Tema</label> 
                    </div>
                    <div>
                        <select id='user-color' value={color} onChange={updateColor} name='user-color'>
                            <option className='theme-standard' value=''>Standard</option>
                            <option className='theme-winter' value='theme-winter'>Vinter</option>
                            <option className='theme-spring' value='theme-spring'>Vår</option>
                            <option className='theme-summer' value='theme-summer'>Sommar</option>
                            <option className='theme-autumn' value='theme-autumn'>Höst</option>
                            <option className='theme-emilia' value='theme-emilia'>Emilia</option>
                            <option className='theme-marcus' value='theme-marcus'>Marcus</option>
                        </select>           
                    </div>
                </div>
                <div className='radio'>
                    <div>
                        <label htmlFor='user-border'>Ram</label> 
                    </div>
                    <div>
                        <select id='user-border' value={border} onChange={updateBorder} name='user-border'>
                            <option className='border-solid' value='border-solid'>Standard</option>
                            <option className='border-dashed' value='border-dashed'>Streckad</option>
                            <option className='border-double' value='border-double'>Dubbel</option>
                            <option className='border-crazy' value='border-crazy'>Galen</option>
                        </select>
                    </div>
                </div>
                <button type='submit'>Spara</button>
            </form>
            {callback}
            <div id='color-box' className={color + ' ' + border}><span className={font}>Typsnitt</span></div>
        </div>
    );
}