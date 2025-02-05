FROM andrejreznik/python-gdal:py3.10.0-gdal3.2.3
LABEL authors="juniorflores"

COPY ./requirements.txt /mnt/requirements.txt
RUN pip install -r /mnt/requirements.txt
WORKDIR /mnt