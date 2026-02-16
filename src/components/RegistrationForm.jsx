import React from 'react';


const RegistrationForm = ({values, onChange, onSubmit, onAdminSubmit, loading, showAdminButton}) => (
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

                {showAdminButton && (
                    <button type="button" onClick={onAdminSubmit} disabled={loading} className="btn-secondary">
                        Регистрация администратора
                    </button>
                )}
            </div>
        </form>
    </div>
);
export default RegistrationForm;