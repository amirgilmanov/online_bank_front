export const VerifySection = ({ form, onChange, onVerify, loading }) => (
    <section>
        <h3>Верификация</h3>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="code" placeholder="Код" value={form.code} onChange={onChange} />
        <input name="deviceName" placeholder="Устройство" value={form.deviceName} onChange={onChange} />
        <button onClick={onVerify} disabled={loading}>Подтвердить</button>
    </section>
);

export const LoginSection = ({ form, onChange, onLogin, loading }) => (
    <section>
        <h3>Логин</h3>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={onChange} />
        <button onClick={onLogin} disabled={loading}>Войти</button>
    </section>
);