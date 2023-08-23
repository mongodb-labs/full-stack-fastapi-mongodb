FROM python:3.11
WORKDIR /app/
ARG \
  HATCH_VERSION=1.7.0 \
  PIPX_VERSION=1.2.0
ENV \
  C_FORCE_ROOT=1 \
  HATCH_ENV_TYPE_VIRTUAL_PATH=.venv \
  HATCH_VERSION=$HATCH_VERSION \
  PATH=/opt/pipx/bin:/app/.venv/bin:$PATH \
  PIPX_BIN_DIR=/opt/pipx/bin \
  PIPX_HOME=/opt/pipx/home \
  PIPX_VERSION=$PIPX_VERSION \
  PYTHONPATH=/app
COPY ./app/ /app/
RUN <<HEREDOC
python -m pip install --no-cache-dir --upgrade pip "pipx==$PIPX_VERSION"
pipx install "hatch==$HATCH_VERSION"
hatch env prune && hatch env create production
chmod +x /app/worker-start.sh
# Neomodel has shapely and libgeos as dependencies
# apt-get update && apt-get install -y libgeos-dev
# /start Project-specific dependencies
# apt-get update && apt-get install -y --no-install-recommends
# rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
# /end Project-specific dependencies
HEREDOC

# For development, Jupyter remote kernel, Hydrogen
# Using inside the container:
# jupyter lab --ip=0.0.0.0 --allow-root --NotebookApp.custom_display_url=http://127.0.0.1:8888
# ARG INSTALL_JUPYTER=false
# RUN bash -c "if [ $INSTALL_JUPYTER == 'true' ] ; then pip install jupyterlab ; fi"

CMD ["bash", "worker-start.sh"]
