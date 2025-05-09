/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState } from 'react';
import RoundedButton from './RoundedButton';

function ScrollToTopButton() {
    const [windowScroll, setWindowScroll] = useState(window.scrollY);

    window.onscroll = () => setWindowScroll(window.scrollY);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div
            className={`${
                windowScroll > 20 ? 'd-flex' : 'd-none'
            } flex-column justify-content-end align-items-end position-fixed bottom-0 end-0 overflow-hidden w-auto h-auto pb-4 pe-4`}
        >
            <RoundedButton icon="stat_3" hsl={[197, 43, 52]} onClick={scrollToTop} className="text-white" />
        </div>
    );
}

export default ScrollToTopButton;
