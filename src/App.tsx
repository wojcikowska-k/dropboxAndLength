import { FC } from 'react';
import {DropBox} from './Components/DropBox.jsx'

import './style.css';


export const App: FC<{ name: string }> = ({ name }) => {
  return (
    <div>
      
      <DropBox className="dropbox" />
    </div>
  );
};
