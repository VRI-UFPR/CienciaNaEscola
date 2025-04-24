/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

/**
 * Um contêiner responsivo baseado no sistema de grid do Bootstrap.
 * @param {Object} props - Propriedades do componente.
 * @param {string|number} [props.df='auto'] - Tamanho padrão da coluna.
 * @param {string|number} props.sm - Tamanho da coluna para telas pequenas.
 * @param {string|number} props.md - Tamanho da coluna para telas médias.
 * @param {string|number} props.lg - Tamanho da coluna para telas grandes.
 * @param {string|number} props.xl - Tamanho da coluna para telas extra grandes.
 * @param {string|number} props.xxl - Tamanho da coluna para telas super grandes.
 * @param {string} props.className - Classes CSS adicionais para o contêiner.
 * @param {React.ReactNode} props.children - Elementos filhos a serem renderizados dentro do contêiner.
*/
function CustomContainer(props) {
    const { df = 'auto', sm, md, lg, xl, xxl, className, children } = props;

    const colClass = [
        `col-${df}`,
        sm && `col-sm-${sm}`,
        md && `col-md-${md}`,
        lg && `col-lg-${lg}`,
        xl && `col-xl-${xl}`,
        xxl && `col-xxl-${xxl}`,
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
