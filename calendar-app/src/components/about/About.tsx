import React from 'react';
import './About.scss';

export default function Signup() {

    return (
        <div id='about'>
            <h1>Om sidan</h1>
            <div>
                <p>
                    Idén för denna hemsida startade med att jag (Marcus) generellt är dålig på att ha koll på saker och att planera. 
                    Jag har försökt mig på fysiska kalendrar men det har inte funkat för mig eftersom man då måste komma ihåg att skriva i den. 
                    Men eftersom jag sitter vid min dator nästan varje dag så kommer denna digitala kalender bli lättare att komma ihåg att skriva i.
                </p>
                <p>
                    Det finns ju såklart redan hemsidor som erbjuder digitala kalendrar men de ser väldigt tråkiga ut så därför har jag valt
                    att lägga till så att man kan designa kalendern lite utifrån vad man själv gillar.
                </p>
                <p>
                    Detta gör man genom att först göra ett konto och sedan logga in, detta gör man för att ens inställningar och anteckningar ska sparas. 
                    Man kan byta typsnitt, färg på bakgrunden och byta ramen runt varje dag. 
                    Kalendern är designad så att man ser en översikt över hela månaden och kan sedan klicka på valfri dag för att lägga in anteckningar, tillexempel om man har ett möte så skriver man in det på rätt dag så syns det sedan i månadsöversikten. 
                    Skriver man in flera grejer så syns inte allt i översikten men det dyker upp texten “och mer...” vilket visar att man har fler saker nerskrivna. För att se dessa är det bara att klicka på dagen. 
                    Varför kalendern inte visar vecka för vecka utan visar hela månaden är för att man ska ha en översikt för hela månaden istället för bara en vecka. 
                </p>
                <p>Välkommen! //Marcus</p>
            </div>
        </div>
    );
}