# Ultimate SQL Manager

Ferramenta desenvolvida para auxiliar na gestão de bancos de dados. O principal
objetivo da ferramenta é funcionar como uma interface única para realizar
operações básicas nos bancos de dados, independente do **SGBD** utilizado.

## Idiomas

O mesmo README está disponível em outros idiomas:

* ![alt text](./readme/brazil-flag.png "Brazilian Flag")  [Portuguese](./README.md)
* ![alt text](./readme/united-kingdom-flag.png "UK Flag") [English](./readme/english.md)

## Como utilizar
```bash
    ./manger.sh <sgbd> <operação> [./workspace]
```

Se uma *workspace* não for fornecida, o diretório padrão (./data) é utilizado.

Todo diretório *workspace* deve seguir a mesma estrutura do diretório ./data

## Funcionalidades

A seguir é listado as funcionalidades atualmente disponíveis.

### Construção (Criação) do banco (*create*)

Dado um banco de dados recém criado, isto é, sem tabelas ou outros elementos, o
comando **create** pode ser utilizado para carregar os arquivos de construção do
banco de dados, gerando uma estrutura sem nenhum dado inserido.

Ao executar a operação **create** os arquivos do diretório **create** serão
executados em ordem alfabética, permitindo a criação de estruturas com
dependências.

### Carregamento em massa (*load*)

A operação **load** pode ser utilizada para inserir dados em massa. Cada um dos
arquivos no diretório **load** será inserido na tabela com o mesmo nome
(removendo a extensão).

Dois formatos de arquivo são permitidos:

* **exemplo.csv**: arquivo CSV com **;** como separador, **\n** como fim de
linha. O arquivo deve obrigatoriamente conter cabeçalho.

* **exemplo.csv.tar.bz2**: Versão compactada do arquivo CSV previamente
descrito. O arquivo compactado deve conter apenas um único arquivo CSV que será
inserido depois de descompactado. Os comandos utilizados para compactar e
descompactar são respectivamente:
```bash
    tar cjf exemplo.csv.tar.bz2 exemplo.csv
    tar xjOf exemplo.csv.tar.bz2 > exemplo.csv
```

ATENÇÃO: A operação **load** é aditiva, isto é, os dados serão
adicionados ao banco, mas os dados já existentes não serão removidos. Para
garantir que o banco tem exatamente os dados contidos em um diretório, a
operação **fixture** deve ser utilizada.

### Limpeza do banco (*clean*)

Remoção de todos os dados inseridos no banco, mas mantendo a estrutura, isto é,
o banco retorna ao estado que estava logo depois da execução da operação
**create**. A operação **clean** é usada para realizar essa tarefa

### Carregamento de *Fixtures* (*fixture*)

Limpa o banco de dados e depois carrega em massa os dados do diretório
**fixture** seguindo o mesmo padrão e restrições da operação **load**.
Operação utilizada para testes, uma vez que garante que o banco contém
exatamente os dados contidos no diretório **fixture**.

AVISO: Embora a operação **fixture** seja equivalente a operação **clean**
seguida de uma operação **load** a operação **fixture** carrega os dados do
diretório **fixture** e não do diretório **load**.

AVISO: A operação **fixture** TODOS removerá os dados já existentes no banco.

### Destruição do banco (*drop*)

Remoção de todas as estruturas do banco de dados. Ao utilizar essa operação
todos os dados e estruturas do banco são removidas. O estado do banco é igual a
o estado antes da operação **create** ser executada. A operação **drop** é
utilizada para realizar essa tarefa.

## SGBD's

Atualmente a ferramenta pode ser utilizada com os seguintes SGBDs:
* PostgreSQL: Testado com a versão 10
* MonetDB: Testado com a versão Apr2019

## Trabalhos Futuros

Conforme demanda o objetivo do projeto é adcionar cada vez mais SGBDs a lista
de SGBDs permitos e mais operações.

SGBDs candidatos a inserção na ferramenta:
* MariaDB

Operações candidatas a inserção na ferramenta:
* Versionamento do banco (migrações)

## Imagens

As imagens das bandeiras foram obtidas em: https://www.iconfinder.com/iconsets/142-mini-country-flags-16x16px
