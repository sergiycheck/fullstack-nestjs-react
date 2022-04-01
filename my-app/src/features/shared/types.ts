export enum StatusData {
  loading = "loading",
  failed = "failed",
  idle = "idle",
  fulfilled = "fulfilled",
}

export type entityExcerptProps = {
  entityId: number | string;
  index: number;
};
