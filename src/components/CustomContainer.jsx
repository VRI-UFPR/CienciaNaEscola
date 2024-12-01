/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

function CustomContainer(props) {
    const { df = 'auto', sm, md, lg, xl, xxl, className, childrenClassName, children } = props;

    const colClass = [
        `col-${df}`,
        sm && `col-sm-${sm}`,
        md && `col-md-${md}`,
        lg && `col-lg-${lg}`,
        xl && `col-xl-${xl}`,
        xxl && `col-xxl-${xxl}`,
        childrenClassName,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={`row justify-content-center align-items-stretch gx-0 ${className}`}>
            <div className={colClass}>
                <div className="d-flex flex-column h-100">{children}</div>
            </div>
        </div>
    );
}

export default CustomContainer;
