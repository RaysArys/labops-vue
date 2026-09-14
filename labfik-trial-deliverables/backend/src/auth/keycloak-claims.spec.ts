import { Role } from '../common/enums/role.enum';
import { extractSystemRole } from './keycloak-claims';

describe('extractSystemRole', () => {
  it('membaca role dari realm_access', () => {
    expect(
      extractSystemRole(
        { sub: '1', realm_access: { roles: ['offline_access', 'laboran'] } },
        'labfik-api',
      ),
    ).toBe(Role.LABORAN);
  });

  it('membaca role dari resource_access client', () => {
    expect(
      extractSystemRole(
        {
          sub: '1',
          resource_access: {
            'labfik-api': { roles: ['teknisi'] },
            account: { roles: ['manage-account'] },
          },
        },
        'labfik-api',
      ),
    ).toBe(Role.TEKNISI);
  });

  it('mengabaikan role Keycloak yang bukan role sistem', () => {
    expect(
      extractSystemRole(
        { sub: '1', realm_access: { roles: ['offline_access'] } },
        'labfik-api',
      ),
    ).toBeUndefined();
  });
});
