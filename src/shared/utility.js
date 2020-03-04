//updateObject jest po to, żeby uprościć maksymalnie kod w reduktorach w sensie, żeby zastąpić całą zawartość poszczególnych
//case'ów w switchu jedynie wywołaniem metody updateObject - ona już za nas kopiuje pierwotny stan a drugi argument
//odpowiada kolejnym właściwościom / elementom pierwotnego stanu, które chemy zaktualizować.

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};