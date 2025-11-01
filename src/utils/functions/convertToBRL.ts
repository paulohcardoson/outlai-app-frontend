export const formatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export const convertToBRL = (value: number) => formatter.format(value);
