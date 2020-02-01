import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class Retail extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address_street: Sequelize.STRING,
        address_number: Sequelize.STRING,
        address_comp: Sequelize.STRING,
        address_neighb: Sequelize.STRING,
        address_city: Sequelize.STRING,
        address_state: Sequelize.STRING,
        address_zip: Sequelize.STRING,
        address_country: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async retail => {
      if (retail.password) {
        retail.password_hash = await bcrypt.hash(retail.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Retail;
