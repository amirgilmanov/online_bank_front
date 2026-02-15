import React from 'react';

const RegistrationForm = ({values, onChange, onSubmit, onAdminSubmit, loading}) => (
    <div className="registration-view">
        <form onSubmit={onSubmit}>
            <input name="name" placeholder="Имя" value={values.name} onChange={onChange} required/>
            <input name="surname" placeholder="Фамилия" value={values.surname} onChange={onChange} required/>
            <input name="patronymic" placeholder="Отчество" value={values.patronymic} onChange={onChange}/>
            <input name="phone" placeholder="Телефон" value={values.phone} onChange={onChange} required/>
            <input name="email" placeholder="Email" value={values.email} onChange={onChange} required/>
            <input name="password" type="password" placeholder="Пароль" value={values.password} onChange={onChange}
                   required/>

            <div className="button-group" style={{marginTop: '20px'}}>
                <button type="submit" disabled={loading}>
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                </button>

                <button type="button" onClick={onAdminSubmit} disabled={loading} className="btn-secondary">
                    Регистрация администратора
                </button>
            </div>
        </form>
    </div>
);

export const VerifySection = ({form, onChange, onVerify, onResend, loading}) => (
    <section style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px'}}>
        <h3>Верификация</h3>
        <p>Код отправлен на почту <b>{form.email}</b></p>

        <input
            name="code"
            placeholder="Введите код"
            value={form.code}
            onChange={onChange}
        />

        <button onClick={onVerify} disabled={loading} className="btn-success">
            Подтвердить
        </button>

        {/* НОВАЯ КНОПКА */}
        <button
            type="button"
            onClick={onResend}
            disabled={loading}
            style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
            }}
        >
            {loading ? "Отправка..." : "Отправить письмо повторно"}
        </button>
    </section>
);

export default RegistrationForm;