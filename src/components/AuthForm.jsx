import React from "react";

export const LoginSection = ({form, onChange, onLogin, loading}) => (
    <section>
        <h3>Войти</h3>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange}/>
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={onChange}/>
        <button onClick={onLogin} disabled={loading}>Войти</button>
    </section>
);

// export const VerifySection = ({form, onChange, onVerify, onResend, loading}) => (
//     <section style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px'}}>
//         <h3>Верификация</h3>
//         <p>Код отправлен на почту <b>{form.email}</b></p>
//         <input name="code" placeholder="Введите код" value={form.code} onChange={onChange} />
//         <button onClick={onVerify} disabled={loading} className="btn-success">Подтвердить</button>
//         <button type="button" onClick={onResend} disabled={loading} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
//             {loading ? "Отправка..." : "Отправить письмо повторно"}
//         </button>
//     </section>

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