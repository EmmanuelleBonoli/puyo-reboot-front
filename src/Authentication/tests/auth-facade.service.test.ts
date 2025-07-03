import { AuthFacadeService } from '../services/auth-facade.service';
import * as AuthStore from '../store/auth.store';
import { createPinia, setActivePinia } from 'pinia';

jest.mock('../services/auth-api.service', () => ({
  loginUser: jest.fn(),
  getUserWithToken: jest.fn(),
}));

import { loginUser, getUserWithToken } from '../services/auth-api.service';

describe('AuthFacadeService', () => {
  let authFacadeService: AuthFacadeService;
  let authStore: ReturnType<typeof AuthStore.useAuthStore>;

  beforeEach(() => {
    jest.clearAllMocks();

    const pinia = createPinia();
    setActivePinia(pinia);
    authStore = AuthStore.useAuthStore();

    authFacadeService = new AuthFacadeService();
  });

  describe('login', () => {
    it('should call loginUser and update store, then return user', async () => {
      const loginMockResponse = {
        token: 'mon super token',
        user: { email: 'test@example.com', id: 1 },
        game: { id: 42, statsGame: {}, restingBubbles: [], waitingBubbles: null, fallingBubbles: null },
      };
      (loginUser as jest.Mock).mockResolvedValue(loginMockResponse);

      jest.spyOn(authStore, 'setAuthData').mockImplementation(jest.fn());

      const result = await authFacadeService.login('test@example.com', 'password123');

      expect(loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(authStore.setAuthData).toHaveBeenCalledWith(loginMockResponse);
      expect(result).toEqual(loginMockResponse.user);
    });
  });

  describe('getUser', () => {
    it('should return user if already in store', async () => {
      const userTest = {
        email: 'stored@example.com',
        playName: 'userTest',
        avatar: 'image avatar link',
        isLeftHanded: false,
      };

      jest.spyOn(authStore, 'getUser').mockReturnValue(userTest);
      jest.spyOn(authStore, 'getToken');

      const result = await authFacadeService.getUser();

      expect(result).toEqual(userTest);
      expect(authStore.getToken).not.toHaveBeenCalled();
    });

    it('should fetch user with token if not in store but token exists', async () => {
      jest.spyOn(authStore, 'getUser').mockReturnValue(null);
      jest.spyOn(authStore, 'getToken').mockReturnValue('fake-token');
      jest.spyOn(authStore, 'setAuthData').mockImplementation(jest.fn());

      (getUserWithToken as jest.Mock).mockResolvedValue({
        token: 'mon super token',
        user: { email: 'api@example.com', id: 3 },
        game: { id: 42, statsGame: {}, restingBubbles: [], waitingBubbles: null, fallingBubbles: null },
      });

      const result = await authFacadeService.getUser();

      expect(getUserWithToken).toHaveBeenCalled();
      expect(authStore.setAuthData).toHaveBeenCalled();
      expect(result).toEqual({ email: 'api@example.com', id: 3 });
    });

    it('should return null and clear store if token fetch fails', async () => {
      jest.spyOn(authStore, 'getUser').mockReturnValue(null);
      jest.spyOn(authStore, 'getToken').mockReturnValue('fake-token');
      jest.spyOn(authStore, 'clearAuthData').mockImplementation(jest.fn());
      (getUserWithToken as jest.Mock).mockRejectedValue(new Error('fail'));

      const result = await authFacadeService.getUser();

      expect(authStore.clearAuthData).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null if no token', async () => {
      jest.spyOn(authStore, 'getUser').mockReturnValue(null);
      jest.spyOn(authStore, 'getToken').mockReturnValue(null);

      const result = await authFacadeService.getUser();

      expect(result).toBeNull();
      expect(getUserWithToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear auth data in store', () => {
      jest.spyOn(authStore, 'clearAuthData').mockImplementation(jest.fn());

      authFacadeService.logout();

      expect(authStore.clearAuthData).toHaveBeenCalled();
    });
  });
});
