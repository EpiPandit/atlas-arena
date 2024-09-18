FROM andrejreznik/python-gdal:py3.8.2-gdal3.0.4
LABEL authors="juniorflores"

COPY ./requirements.txt /mnt/requirements.txt
RUN pip install -r /mnt/requirements.txt
WORKDIR /mnt