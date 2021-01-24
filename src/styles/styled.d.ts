import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    secondary: string;
    textPrimary: string;
    black: string;
    error: string;
    sucess: string;
  }
}
