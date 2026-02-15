export const LoginSection = ({form, onChange, onLogin, loading}) => (
    <section>
        <h3>Войти</h3>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange}/>
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={onChange}/>
        <button onClick={onLogin} disabled={loading}>Войти</button>
    </section>
);