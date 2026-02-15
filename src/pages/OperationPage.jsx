import React, {useState} from 'react';
import {OperationApi} from '../api';
import {useForm} from '../hooks/useForm'; // Тот самый универсальный хук
import OperationTable from '../components/OperationTable';

const OperationPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [operations, setOperations] = useState([]);

    // ОШИБКА БЫЛА ТУТ: Убедись, что все поля объявлены в начальном состоянии
    const {values, handleChange} = useForm({
        baseAccountNumber: '', // Должно быть в точности как в input name
        targetAccountNumber: '',
        amount: '',
        description: ''
    });

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await OperationApi.transfer({
                ...values,
                amount: parseFloat(values.amount)
            });
            // Если сервер возвращает одну операцию, кладем её в массив для таблицы
            setOperations(Array.isArray(result) ? result : [result]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Перевод средств</h2>

            <form onSubmit={handleTransfer}>
                <div className="form-group">
                    <label>Счет отправителя:</label>
                    <input
                        name="baseAccountNumber" // Имя должно совпадать с ключом в useForm
                        value={values.baseAccountNumber || ''} // Защита: если values вдруг undefined
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Счет получателя:</label>
                    <input
                        name="targetAccountNumber"
                        value={values.targetAccountNumber || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Сумма:</label>
                    <input
                        type="number"
                        name="amount"
                        value={values.amount || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Отправка...' : 'Перевести'}
                </button>
            </form>

            {error && <p className="error" style={{color: 'red'}}>{error}</p>}

            <div style={{marginTop: '20px'}}>
                <OperationTable operations={operations}/>
            </div>
        </div>
    );
};

export default OperationPage;