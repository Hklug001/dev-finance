const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('finances:transaction')) || [];
    },

    set(transactions) {
        localStorage.setItem('finances:transaction', JSON.stringify(transactions));
    },
}

const Transactions = {
    all: transaction = Storage.get(),

    createTransactions(index) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            `
            <td class="description">${Transactions.all[index].description}</td>
            <td class="${Transactions.all[index].amount > 0 ? 'income' : 'expense'}">${Util.formatCurrency(Transactions.all[index].amount)}</td>
            <td class="date">${Transactions.all[index].date}</td>
            <td><img src="assets/minus.svg" alt="minus icon" onclick="Transactions.removeTransaction(${index})" title="remove"></td>
            `
        document.querySelector('tbody').appendChild(tr);
    },

    addTransaction(transaction) {
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
        document.querySelector('#amountDisplay').innerHTML = Util.formatCurrency(Balance.getAmount());
        document.querySelector('#totalDisplay').innerHTML = Util.formatCurrency(Balance.getTotal());
    },

    getIncome() {
        let income = 0;
        Transactions.all.forEach(tran => {
            if (tran.amount > 0) {
                income += tran.amount;
            }
        })
        return income;
    },

    getAmount() {
        let amount = 0;
        Transactions.all.forEach(tran => {
            if (tran.amount < 0) {
                amount += tran.amount;
            }
        })
        return amount;
    },

    getTotal() {
        let total = Balance.getIncome() + Balance.getAmount()
        return total;
    },
}

const Form = {

    description: document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    date: document.querySelector('#date'),

    toggleModal() {
        document.querySelector('.modal-overlay').classList.toggle('active');
    },

    getValues() {
        return {
            description: Form.description.value,
            amount: Util.formatAmount(Form.amount.value),
            date: Util.formatDate(Form.date.value),
        }
    },

    clearForm() {
        Form.description.value = '';
        Form.amount.value = '';
        Form.date.value = '';
    },

    submitForm(event) {
        event.preventDefault();

        const newTransaction = Form.getValues();
        Transactions.addTransaction(newTransaction);

        Form.clearForm();
        Form.toggleModal();
        App.reload();
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

    formatAmount(amount) {
        amount = Number(amount) * 100;
        return amount;
    },

    formatDate(date) {
        date = date.split('-').reverse();
        return String(date).replace(/\,/g, '/');
    }
}

const App = {
    init() {
        Transactions.all.forEach(transactionObj => {
            Transactions.createTransactions(transaction.indexOf(transactionObj))
        });
        Balance.updateBalance();
        Storage.set(Transactions.all);
    },
    reload() {
        Transactions.clearTransactions();
        App.init();
    },
}

App.init(); 