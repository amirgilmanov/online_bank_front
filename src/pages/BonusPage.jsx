import React, {useState} from "react";
import {BonusApi} from "../api";
import {useBonusForm} from "../hooks/useBonusForm";
import OperationTable from "../components/OperationTable";

const BonusPage = () => {
    const {form, handleChange} = useBonusForm();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConvert = async () => {
        setLoading(true);
        setError(null);
        try {
            // Токен подхватится автоматически из axiosConfig
            const data = await BonusApi.convert(form);
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Бонусный счёт</h2>

            <section className="form-section">
                <h3>Конвертация бонусов</h3>
                <input
                    name="accountNumber"
                    placeholder="Номер счёта для зачисления"
                    value={form.accountNumber}
                    onChange={handleChange}
                />
                <input
                    name="points"
                    placeholder="Количество бонусов"
                    value={form.points}
                    onChange={handleChange}
                />
                <button onClick={handleConvert} disabled={loading}>
                    {loading ? "Конвертация..." : "Конвертировать в валюту"}
                </button>
            </section>

            {error && <p className="error" style={{color: 'red'}}>{error}</p>}

            {/* Переиспользуем таблицу операций!
                Оборачиваем результат в массив [result], так как таблица ждет массив */}
            {result && (
                <section style={{marginTop: '20px'}}>
                    <h3>Результат конвертации</h3>
                    <OperationTable operations={[result]}/>
                </section>
            )}
        </div>
    );
};

export default BonusPage;