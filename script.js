const Transactions = {
    all: transaction = [
        {
            description: 'luz',
            expense: -50001,
            date: '23/01/2022'
        },
        {
            description: 'Website',
            expense: 500038,
            date: '23/01/2022'
        },
        {
            description: 'Internet',
            expense: -20045,
            date: '23/01/2022'
        },
        {
            description: 'App',
            expense: 200076,
            date: '23/01/2022'
        },
    ],
    addTransaction(index) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            `
            <td class="description">${Transactions.all[index].description}</td>
            <td class="${Transactions.all[index].expense > 0 ? 'income' : 'expense'}">${Util.formatCurrency(Transactions.all[index].expense)}</td>
            <td class="date">${Transactions.all[index].date}</td>
            <td><img src="assets/minus.svg" alt="minus icon"></td>
            `
        document.querySelector('tbody').appendChild(tr);
    },

    createTransaction(transaction) {
        Transactions.all.push(transaction);

        App.reload();
    },

    removeTransaction(index) {
        Transactions.all.splice(index, 1);

        App.reload();
    },

    clearTransactions() {
        document.querySelector('tbody').innerHTML = ''
    }
}

const Balance = {
    updateBalance() {
        document.querySelector('#incomeDisplay').innerHTML = Util.formatCurrency(Balance.getIncome());
        document.querySelector('#expenseDisplay').innerHTML = Util.formatCurrency(Balance.getExpenses());
        document.querySelector('#totalDisplay').innerHTML = Util.formatCurrency(Balance.getTotal());
    },

    getIncome() {
        let income = 0;
        Transactions.all.forEach(tran => {
            if (tran.expense > 0) {
                income += tran.expense;
            }
        })
        return (income);
    },

    getExpenses() {
        let expense = 0;
        Transactions.all.forEach(tran => {
            if (tran.expense < 0) {
                expense += tran.expense;
            }
        })
        return (expense);
    },

    getTotal() {
        let total = Balance.getIncome() + Balance.getExpenses()
        return (total);
    },
}

const Form = {
    toggleModal() {
        document.querySelector('.modal-overlay').classList.toggle('active');
    },

    getValues() {
        return {
            description: document.querySelector('#description').value,
            amount: document.querySelector('#amount').value,
            date: document.querySelector('#date').value,
        }
    },

    submitForm(event) {
        event.preventDefault();

    }
}

const Util = {
    formatCurrency(value) {
        const signal = Number(value) > 0 ? '' : '-';

        value = String(value).replace(/\D/g, '');
        value = Number(value) / 100;
        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value;

    },
}

const App = {
    init() {
        Transactions.all.forEach(transactionObj => {
            Transactions.addTransaction(transaction.indexOf(transactionObj))
        });
        Balance.updateBalance();
    },
    reload() {
        Transactions.clearTransactions();
        App.init();
    },
}

App.init();