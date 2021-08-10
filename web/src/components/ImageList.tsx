import { FC } from "react";
import styled from "styled-components";
import { getAssetUrl } from "../constants/apiRoutes";
import { IPost } from "../constants/models";
import { theme } from "../theme/theme.config";

interface ImageListProps {
  posts: IPost[];

  onClickImage(post: IPost): void;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  & > * {
    flex-basis: calc(33.33% - 0.5rem);

    max-width: calc(33.33% - 0.5rem);

    cursor: pointer;
  }

  ${theme.mediaQueries.tablet} {
    & > * {
      flex-basis: calc(50% - 0.25rem);

      max-width: calc(50% - 0.25rem);
    }
  }
`;

const ImageList: FC<ImageListProps> = ({
  posts,
  onClickImage,
}: ImageListProps) => {
  return (
    <Container>
      {posts.map(
        (post) =>
          post.attachment && (
            <img
              key={post.id}
              src={getAssetUrl(post.attachment)}
              alt=""
              onClick={() => onClickImage(post)}
            />
          )
      )}
    </Container>
  );
};

export default ImageList;
