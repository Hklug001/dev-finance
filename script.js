const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('finances:transaction')) || [];
    },

    set(transactions) {
        localStorage.setItem('finances:transaction', JSON.stringify(transactions));
    },
}

const Transactions = {
    all: Storage.get(),

    createTransactions(index) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            `
            <td class="description">${Transactions.all[index].description}</td>
            <td class="${Transactions.all[index].amount > 0 ? 'income' : 'expense'}">${Util.formatCurrency(Transactions.all[index].amount)}</td>
            <td class="date">${Transactions.all[index].date}</td>
            <td><img src="assets/plus.svg" alt="plus icon" onclick="Transactions.updateTransaction(${index})" title="update"></td>
            <td><img src="assets/minus.svg" alt="minus icon" onclick="Transactions.removeTransaction(${index})" title="remove"></td>
            `
        document.querySelector('tbody').appendChild(tr);
    },

    addTransaction(transaction) {
        Transactions.all.push(transaction);
    },

    updateTransaction(index) {
        Form.toggleModalForUpdate();
        document.querySelector('#descriptionUpdate').value = Transactions.all[index].description;
        document.querySelector('#amountUpdate').value = Util.reFormatCurrency(Transactions.all[index].amount);
        document.querySelector('#dateUpdate').value = Util.reFormatDate(Transactions.all[index].date);
        Form.updateIndex = index;
    },

    addUpdateTransaction(transaction, index) {
        Transactions.all[index] = transaction;
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

    updateIndex: 0,

    toggleModal() {
        document.querySelector('.modal-overlay').classList.toggle('active');
    },

    toggleModalForUpdate() {
        document.querySelector('.modal-overlay.update').classList.toggle('active');
    },

    getValues() {
        return {
            description: Form.description.value,
            amount: Util.formatAmount(Form.amount.value),
            date: Util.formatDate(Form.date.value),
        }
    },

    getUpdatedValues() {
        return {
            description: document.querySelector('#descriptionUpdate').value,
            amount: Util.formatAmount(document.querySelector('#amountUpdate').value),
            date: Util.formatDate(document.querySelector('#dateUpdate').value),
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
    },

    submitFormForUpdate(event) {
        event.preventDefault();

        const updatedTransaction = Form.getUpdatedValues();
        Transactions.addUpdateTransaction(updatedTransaction, Form.updateIndex);

        Form.toggleModalForUpdate();
        App.reload();
    },
}

const Util = {
    formatCurrency(value) {
        const signal = Number(value) >= 0 ? '' : '-';

        value = String(value).replace(/\D/g, '');
        value = Number(value) / 100;
        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value;

    },

    formatAmount(amount) {
        amount = amount * 100;
        return Math.round(amount);
    },

    formatDate(date) {
        date = date.split('-').reverse();
        return String(date).replace(/\,/g, '/');
    },

    reFormatCurrency(value) {
        return value / 100;
    },

    reFormatDate(date) {
        date = date.split('/').reverse();
        return String(date).replace(/\,/g, '-');
    },
}

const App = {
    init() {
        Transactions.all.forEach(transactionObj => {
            Transactions.createTransactions(Transactions.all.indexOf(transactionObj))
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